'use client';
import React from 'react';
import Image from 'next/image';

interface Props {
   children: React.ReactNode;
   fallbackSrc?: string;
   fallbackAlt?: string;
}

interface State {
   hasError: boolean;
}

export class CanvasErrorBoundary extends React.Component<Props, State> {
   constructor(props: Props) {
      super(props);
      this.state = { hasError: false };
   }

   static getDerivedStateFromError(): State {
      return { hasError: true };
   }

   render() {
      if (this.state.hasError) {
         const { fallbackSrc, fallbackAlt = 'Artifact image' } = this.props;
         return (
            <div className="relative w-full h-full min-h-[400px] flex items-center justify-center bg-[#14110c] rounded-xl">
               {fallbackSrc ? (
                  <Image
                     src={fallbackSrc}
                     alt={fallbackAlt}
                     fill
                     className="object-contain rounded-xl opacity-80"
                  />
               ) : (
                  <p className="text-amber-100/50 text-sm">
                     3D model unavailable
                  </p>
               )}
            </div>
         );
      }

      return this.props.children;
   }
}
