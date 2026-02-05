import { Button } from '@/components/button/Button';
import Link from 'next/link';
import { Metadata } from 'next';
import HeroSection from '@/components/heroSection';
import Partners from './partners/page';
import BlogList from '@/components/BlogList';
import InfoGrid from '@/components/InfoCard';
import IntegrationGrid from '@/components/IntegrationCard';
import LeadingLaides from '@/components/leadingLaides';
import WhatIsSummitShare from '@/components/whatIsSummitShare';
import ProblemSection from '@/components/problemSection';
import CollaborateWithUs from '@/components/collaborateWithUs';

const metadata: Metadata = {
   title: 'SummitShare',
   description:
      'A pioneering digital platform dedicated to the repatriation of African cultural artifacts. ',
   icons: {
      icon: '/favicon.ico',
   },
};

export default function Home() {
   return (
      <main className="flex flex-col overflow-hidden">
         {/* Hero - Full width */}
         <HeroSection />

         {/* Main content sections with tighter spacing */}
         <div className="flex flex-col ">
            {/* What is SummitShare */}
            <div className="mt-16 md:mb-24 mb-32">
               <WhatIsSummitShare />
            </div>

            {/* Problem Statement */}
            <div className="w-full">
               <ProblemSection />
            </div>

            {/* Solutions section */}
            <div className="bg-neutral-50 w-full py-20 ">
               <InfoGrid />
            </div>

            {/* Implementation section */}
            <div className="bg-neutral-900 md:mb-24 mb-32">
               {' '}
               {/* Negative margin to pull closer to previous section */}
               <IntegrationGrid />
            </div>

            {/* Updates section */}
            <div>
               <BlogList />
            </div>

            {/* Partners section */}
            <div className="w-full py-20 md:mb-24 mb-32">
               <Partners />
            </div>

            {/* Call to action */}
            <div>
               <CollaborateWithUs />
            </div>
         </div>
      </main>
   );
}
