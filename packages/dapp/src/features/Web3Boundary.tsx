'use client';

import dynamic from 'next/dynamic';
import {
   createContext,
   useCallback,
   useContext,
   useEffect,
   useMemo,
   useRef,
   useState,
   type ReactNode,
} from 'react';

type Web3Activation = {
   active: boolean;
   activate: (openModal?: boolean) => void;
   consumeModalRequest: () => boolean;
};

const Web3ActivationContext = createContext<Web3Activation | null>(null);
const Web3FallbackContext = createContext<ReactNode>(null);

function Web3Fallback() {
   return <>{useContext(Web3FallbackContext)}</>;
}

const LazyWeb3Provider = dynamic(
   () => import('./Web3Provider').then((module) => module.Web3Provider),
   { ssr: false, loading: Web3Fallback }
);

export function useWeb3Activation() {
   const activation = useContext(Web3ActivationContext);

   if (!activation) {
      throw new Error('useWeb3Activation must be used within Web3Boundary');
   }

   return activation;
}

export default function Web3Boundary({ children }: { children: ReactNode }) {
   const [requested, setRequested] = useState(false);
   const modalRequested = useRef(false);

   const activate = useCallback((openModal = false) => {
      if (openModal) modalRequested.current = true;
      setRequested(true);
   }, []);

   // Both desktop and mobile nav buttons mount; only one consumes the click.
   const consumeModalRequest = useCallback(() => {
      const pending = modalRequested.current;
      modalRequested.current = false;
      return pending;
   }, []);

   useEffect(() => {
      try {
         const stored = JSON.parse(localStorage.getItem('wagmi.store') ?? 'null');
         const connections = stored?.state?.connections;

         if (
            stored?.state?.current ||
            (Array.isArray(connections) && connections.length > 0) ||
            (Array.isArray(connections?.value) && connections.value.length > 0)
         ) {
            activate();
         }
      } catch {
         // Unavailable or malformed storage is a disconnected visit.
      }
   }, [activate]);

   const inactive = useMemo(
      () => ({ active: false, activate, consumeModalRequest }),
      [activate, consumeModalRequest]
   );
   const active = useMemo(() => ({ ...inactive, active: true }), [inactive]);

   return (
      <Web3ActivationContext.Provider value={inactive}>
         {requested ? (
            <Web3FallbackContext.Provider value={children}>
               <LazyWeb3Provider>
                  {/* Hooks are enabled only inside the mounted provider. */}
                  <Web3ActivationContext.Provider value={active}>
                     {children}
                  </Web3ActivationContext.Provider>
               </LazyWeb3Provider>
            </Web3FallbackContext.Provider>
         ) : (
            children
         )}
      </Web3ActivationContext.Provider>
   );
}

/**
 * Renders `children` only once the wallet provider is mounted, activating it on
 * mount. Outside a `Web3Boundary` it renders `fallback` forever rather than
 * throwing: this is used inside the shared `Button`, which also renders on
 * `(auth)` routes where no boundary exists. A button falling back to its label
 * is a better failure than a blank page.
 */
export function RequireWeb3({
   children,
   fallback = null,
}: {
   children: ReactNode;
   fallback?: ReactNode;
}) {
   const activation = useContext(Web3ActivationContext);
   const activate = activation?.activate;

   useEffect(() => {
      activate?.();
   }, [activate]);

   return <>{activation?.active ? children : fallback}</>;
}
