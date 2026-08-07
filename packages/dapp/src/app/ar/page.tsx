import ARClient from '@/features/ar/ARClient';
import { AR_ARTIFACTS } from '@/features/ar/artifacts';

export default function ARDemoPage() {
   return <ARClient artifact={AR_ARTIFACTS.drum} preferWebXR />;
}
