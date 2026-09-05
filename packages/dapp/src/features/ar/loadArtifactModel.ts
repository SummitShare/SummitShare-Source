import type { Material, Object3D, Texture } from 'three'

export interface ArtifactModelLoadOptions {
  modelPath: string
  /** Empty selects DRACOLoader's module-bundled decoder. */
  dracoDecoderPath?: string
  isCancelled: () => boolean
  onProgress: (progress: number | null) => void
}

export interface LoadedArtifactModel {
  model: Object3D
  dispose: () => void
}

interface OriginalMaterialOpacityState {
  transparent: boolean
  depthWrite: boolean
  opacity: number
}

const originalMaterialOpacityStates = new WeakMap<
  Material,
  OriginalMaterialOpacityState
>()

export const applyArtifactModelOpacity = (
  root: Object3D,
  recommendedOpacity: number,
) => {
  const opacity = Math.min(1, Math.max(0, recommendedOpacity))

  root.traverse((object) => {
    const renderable = object as Object3D & {
      material?: Material | Material[]
    }
    const materials = Array.isArray(renderable.material)
      ? renderable.material
      : renderable.material
        ? [renderable.material]
        : []

    for (const material of materials) {
      let original = originalMaterialOpacityStates.get(material)
      if (!original) {
        original = {
          transparent: material.transparent,
          depthWrite: material.depthWrite,
          opacity: material.opacity,
        }
        originalMaterialOpacityStates.set(material, original)
      }

      const transparent = opacity < 1 ? true : original.transparent
      if (material.transparent !== transparent) {
        material.transparent = transparent
        material.needsUpdate = true
      }
      material.depthWrite = opacity < 1 ? false : original.depthWrite
      material.opacity = opacity < 1 ? original.opacity * opacity : original.opacity
    }
  })
}

const prepareArtifactModelLoader = () =>
  Promise.all([
    import('three'),
    import('three/examples/jsm/loaders/GLTFLoader.js'),
    import('three/examples/jsm/loaders/DRACOLoader.js'),
  ])

export const prepareArtifactModelLoaderModules = prepareArtifactModelLoader

const disposeObject = (
  root: Object3D,
  TextureClass: typeof Texture,
): (() => void) => {
  return () => {
    const disposedMaterials = new Set<Material>()
    const disposedTextures = new Set<Texture>()

    root.traverse((object) => {
      const renderable = object as Object3D & {
        geometry?: { dispose: () => void }
        material?: Material | Material[]
      }
      renderable.geometry?.dispose()

      const materials = Array.isArray(renderable.material)
        ? renderable.material
        : renderable.material
          ? [renderable.material]
          : []

      for (const material of materials) {
        if (disposedMaterials.has(material)) continue
        disposedMaterials.add(material)

        for (const value of Object.values(material)) {
          if (
            value instanceof TextureClass &&
            !disposedTextures.has(value)
          ) {
            disposedTextures.add(value)
            value.dispose()
          }
        }
        material.dispose()
      }
    })
  }
}

const cancelled = () => new DOMException('Artifact model load cancelled.', 'AbortError')

export async function loadArtifactModel({
  modelPath,
  dracoDecoderPath,
  isCancelled,
  onProgress,
}: ArtifactModelLoadOptions): Promise<LoadedArtifactModel> {
  const [THREE, { GLTFLoader }, { DRACOLoader }] =
    await prepareArtifactModelLoader()

  if (isCancelled()) throw cancelled()

  const dracoLoader = new DRACOLoader()
  if (dracoDecoderPath) {
    dracoLoader.setDecoderPath(dracoDecoderPath)
    dracoLoader.setDecoderConfig({ type: 'wasm' })
  }
  const gltfLoader = new GLTFLoader()
  gltfLoader.setDRACOLoader(dracoLoader)

  let disposeModel: (() => void) | null = null
  let disposed = false
  const dispose = () => {
    if (disposed) return
    disposed = true
    disposeModel?.()
    dracoLoader.dispose()
  }

  try {
    const gltf = await gltfLoader.loadAsync(modelPath, (event) => {
      if (isCancelled()) return
      onProgress(
        event.total > 0
          ? Math.min(100, Math.round((event.loaded / event.total) * 100))
          : null,
      )
    })

    const model = gltf.scene
    disposeModel = disposeObject(model, THREE.Texture)
    if (isCancelled()) {
      dispose()
      throw cancelled()
    }

    // Keep local and world coordinates identical for every Box3 operation.
    // The model is deliberately not parented until normalization is complete.
    model.updateMatrixWorld(true)
    const bounds = new THREE.Box3().setFromObject(model)
    const size = bounds.getSize(new THREE.Vector3())
    if (
      !Number.isFinite(size.x) ||
      !Number.isFinite(size.y) ||
      !Number.isFinite(size.z) ||
      size.y <= 0
    ) {
      throw new Error('The artifact model has invalid bounds.')
    }

    model.scale.multiplyScalar(1 / size.y)
    model.updateMatrixWorld(true)
    const unitBounds = new THREE.Box3().setFromObject(model)
    const center = unitBounds.getCenter(new THREE.Vector3())
    model.position.set(
      model.position.x - center.x,
      model.position.y - unitBounds.min.y,
      model.position.z - center.z,
    )

    return { model, dispose }
  } catch (error) {
    dispose()
    throw error
  }
}
