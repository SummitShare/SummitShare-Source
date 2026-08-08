import { notFound } from 'next/navigation';
import ARClient from '@/features/ar/ARClient';
import {
   AR_ARTIFACTS,
   AR_ARTIFACT_SLUGS,
   isARArtifactSlug,
} from '@/features/ar/artifacts';

interface ARPageProps {
   params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
   return AR_ARTIFACT_SLUGS.map((slug) => ({ slug }));
}

export default async function ARPage({ params }: ARPageProps) {
   const { slug } = await params;
   if (!isARArtifactSlug(slug)) {
      notFound();
   }

   const artifact = AR_ARTIFACTS[slug];

   return (
      <ARClient artifact={artifact} preferWebXR={artifact.webxr.calibrated} />
   );
}
