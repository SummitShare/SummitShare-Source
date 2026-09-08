import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { Group, Matrix4, Quaternion, Vector3 } from 'three';
import { describe, expect, it, vi } from 'vitest';
import {
   createMindARPoseRelay,
   DEFAULT_MINDAR_POSE_PARAMETERS,
} from './mindarPose';
import { createMindARPosePresentation } from './mindarPresentation';

// Execute the viewer's actual callbacks, not a second implementation of them.
// This checks scheduling/ownership contracts; it does not replace a phone camera test.
const source = readFileSync(new URL('./VitrineAR.tsx', import.meta.url), 'utf8');
const ast = ts.createSourceFile(
   'VitrineAR.tsx',
   source,
   ts.ScriptTarget.Latest,
   true,
   ts.ScriptKind.TSX
);
const find = (predicate: (node: ts.Node) => boolean): ts.Node => {
   let match: ts.Node | undefined;
   const visit = (node: ts.Node) => {
      if (!match && predicate(node)) match = node;
      if (!match) ts.forEachChild(node, visit);
   };
   visit(ast);
   if (!match) throw new Error('Viewer callback not found');
   return match;
};
const initializer = (name: string) =>
   (
      find(
         (node) =>
            ts.isVariableDeclaration(node) && node.name.getText(ast) === name
      ) as ts.VariableDeclaration
   ).initializer!;
const compile = (node: ts.Node, context: vm.Context) =>
   vm.runInContext(
      ts.transpileModule(`(${node.getText(ast)})`, {
         compilerOptions: { target: ts.ScriptTarget.ES2022 },
      }).outputText,
      context
   );

describe('production MindAR callback integration', () => {
   it('uses fixed validated settings, guards jumps and samples between pose callbacks', () => {
      const poseRelay = createMindARPoseRelay(),
         posePresentation = createMindARPosePresentation();
      const poseGroup = new Group(),
         targetUnitGroup = new Group();
      const anchor = { visible: true, group: new Group() };
      let at = 0;
      const visibility = vi.fn((visible: boolean) => {
         poseGroup.visible = visible;
      });
      const context = vm.createContext({
         DEFAULT_MINDAR_POSE_PARAMETERS,
         poseRelay,
         posePresentation,
         poseGroup,
         targetUnitGroup,
         anchor,
         session: { cleaned: false, uprightArtifact: null },
         performance: { now: () => at },
         mindAR: { renderer: { render: vi.fn() }, scene: {}, camera: {} },
         poseUpdatePending: false,
         poseUpdatePendingAt: 0,
         recommendedOpacity: 0,
         applyArtifactModelOpacity: vi.fn(),
         applyRelayVisibility: visibility,
         modelReady: false,
         mountedRef: { current: true },
         attemptRef: { current: 1 },
         attempt: 1,
      });
      context.POSE_RESPONSE_MS = compile(
         initializer('POSE_RESPONSE_MS'),
         context
      );
      context.JUMP_GUARD = compile(initializer('JUMP_GUARD'), context);
      expect(context.POSE_RESPONSE_MS).toBe(100);
      expect(context.JUMP_GUARD).toEqual({
         translationThresholdTargetUnits: 0.5,
         rotationThresholdDegrees: 45,
         confirmationMs: 120,
         maxWaitMs: 250,
      });
      const render = compile(
         (
            find(
               (node) =>
                  ts.isCallExpression(node) &&
                  node.expression.getText(ast) ===
                     'mindAR.renderer.setAnimationLoop'
            ) as ts.CallExpression
         ).arguments[0],
         context
      );
      const event = (name: string) =>
         compile(
            (
               find(
                  (node) =>
                     ts.isBinaryExpression(node) &&
                     node.left.getText(ast) === `anchor.${name}`
               ) as ts.BinaryExpression
            ).right,
            context
         );
      const decision = vi.spyOn(posePresentation, 'setTarget');
      const publish = (time: number, x: number, yaw = 0) => {
         at = time;
         anchor.group.matrix.compose(
            new Vector3(x, 0, -4096),
            new Quaternion().setFromAxisAngle(
               new Vector3(0, 1, 0),
               (yaw * Math.PI) / 180
            ),
            new Vector3(1024, 1024, 1024)
         );
         context.poseUpdatePendingAt = time - 4;
         context.poseUpdatePending = true;
         render();
      };
      publish(10, 0);
      publish(110, 2048, 80);
      expect(decision.mock.results.at(-1)?.value).toBe('pending');
      expect(poseGroup.matrix.elements[12]).toBe(0);
      publish(170, 0);
      expect(decision.mock.results.at(-1)?.value).toBe('cancelled');
      publish(210, 2048, 80);
      publish(330, 2049, 80);
      expect(decision.mock.results.at(-1)?.value).toBe('confirmed');
      at = 380;
      render();
      expect(poseGroup.matrix.elements[12]).toBeGreaterThan(0);
      expect(poseGroup.matrix.elements[12]).toBeLessThan(2049);
      expect(targetUnitGroup.scale.x).toBe(1024);
      anchor.visible = false;
      event('onTargetLost')();
      expect(posePresentation.sample(at, 100)).toBeNull();
      expect(poseGroup.visible).toBe(false);
      anchor.visible = true;
      context.relayPoseVisible = false;
      event('onTargetFound')();
      publish(410, -1024);
      expect(poseGroup.matrix.elements[12]).toBe(-1024);
      for (let i = 0; i < 4; i++) {
         at += 40;
         anchor.group.matrix = new Matrix4().makeScale(0, 0, 0);
         anchor.group.matrix.elements[12] = i;
         context.poseUpdatePendingAt = at;
         context.poseUpdatePending = true;
         render();
      }
      expect(posePresentation.sample(at, 100)).toBeNull();
      expect(poseGroup.visible).toBe(false);
      publish(at + 40, 1024);
      expect(poseGroup.matrix.elements[12]).toBe(1024);
   });

   it('releases late camera/model resources but tears down the renderer only once', async () => {
      const stopTrack = vi.fn();
      class Stream {
         getTracks() {
            return [{ stop: stopTrack }];
         }
      }
      const disposeModel = vi.fn(),
         disposeDraco = vi.fn();
      const video = { srcObject: null as Stream | null, remove: vi.fn() };
      const renderer = {
         setAnimationLoop: vi.fn(),
         dispose: vi.fn(),
         forceContextLoss: vi.fn(),
         domElement: { remove: vi.fn() },
      };
      const session = {
         cleaned: false,
         disposeViewport: vi.fn(),
         anchor: {},
         poseRelay: createMindARPoseRelay(),
         posePresentation: createMindARPosePresentation(),
         poseGroup: new Group(),
         targetUnitGroup: new Group(),
         injectedStyles: [],
         mindAR: {
            stop: vi.fn(),
            video,
            renderer,
            cssRenderer: { domElement: { remove: vi.fn() } },
         },
         disposeModel: null as (() => void) | null,
         disposeDraco: null as (() => void) | null,
      };
      const sessionRef = { current: session };
      const context = vm.createContext({
         sessionRef,
         dragRef: { current: null },
         MediaStream: Stream,
      });
      const cleanup = compile(
         (initializer('cleanupKnownSession') as ts.CallExpression).arguments[0],
         context
      );
      cleanup(session);
      const replacement = { ...session, cleaned: false };
      sessionRef.current = replacement;
      await Promise.resolve();
      video.srcObject = new Stream();
      session.disposeModel = disposeModel;
      session.disposeDraco = disposeDraco;
      cleanup(session);
      expect(stopTrack).toHaveBeenCalledOnce();
      expect(disposeModel).toHaveBeenCalledOnce();
      expect(disposeDraco).toHaveBeenCalledOnce();
      expect(renderer.dispose).toHaveBeenCalledOnce();
      expect(sessionRef.current).toBe(replacement);
      cleanup(session);
      expect(disposeModel).toHaveBeenCalledOnce();
      expect(renderer.dispose).toHaveBeenCalledOnce();
      expect(session.posePresentation.sample(100, 100)).toBeNull();
   });
});
