import React from 'react';
import { Github } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../button/Button';

type InternalLinkProps = {
   href: string;
   className?: string;
   plain?: boolean;
   children: React.ReactNode;
};

/**
 * `next/link` cannot do a client transition to a route under a different root
 * layout — the browser does a full document load either way — but the router
 * still prefetches the destination's chunks on sight. On `/record` that pulled
 * 1.2 MB of Web3 and auth bundle onto a static page. Measured: `prefetch={false}`
 * does not prevent it; only not using `Link` does.
 */
function InternalLink({ href, className, plain, children }: InternalLinkProps) {
   if (plain) {
      return (
         <a href={href} className={className}>
            {children}
         </a>
      );
   }
   return (
      <Link href={href} className={className}>
         {children}
      </Link>
   );
}

type FooterProps = {
   /**
    * Set on pages that live outside the `(main)` root layout. Leaves the
    * `(main)` routes untouched, where prefetching genuinely pays off.
    */
   crossDocumentLinks?: boolean;
};

function Footer({ crossDocumentLinks = false }: FooterProps) {
   return (
      <footer className="w-full bg-neutral-50">
         <div className="w-full px-4 sm:px-6 lg:px-[15%] py-12">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-8 w-full text-center sm:text-left sm:items-start">
               {/* Newsletter Section */}
               <div className="lg:col-span-5">
                  <h3 className="text-xl font-semibold text-stone-800 mb-3">
                     Contact Support
                  </h3>
                  <p className="text-stone-600 mb-4">
                     Click the button below to email support
                  </p>
                  <div className="max-w-md mx-auto sm:mx-0">
                     <a
                        href="mailto:support@summitshare.co?subject=Inquiry%20About%20SummitShare&body=Dear%20SummitShare%20Team,%0D%0A%0D%0AI'm%20reaching%20out%20regarding%20[provide%20details%20about%20your%20inquiry].%20Could%20you%20please%20assist%20me%20with%20[add%20specific%20details%20or%20questions]?%0D%0A%0D%0AThank%20you%20for%20your%20support.%20Looking%20forward%20to%20hearing%20from%20you.%0D%0A%0D%0ABest%20regards,%0D%0A[Your%20Name]"
                        target="_blank"
                     >
                        <Button>Email</Button>
                     </a>
                  </div>
               </div>

               {/* Links Section */}
               <div className="lg:col-span-7">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
                     {/* Quick Links */}
                     <div>
                        <h3 className="text-lg font-semibold text-stone-800 mb-4">
                           Quick Links
                        </h3>
                        <ul className="space-y-2">
                           <li>
                              <InternalLink
                                 href="/blog"
                                 plain={crossDocumentLinks}
                                 className="text-stone-600 hover:text-stone-900 transition-colors"
                              >
                                 Blogs
                              </InternalLink>
                           </li>
                           <li>
                              <a
                                 href="https://www.kraken.com/learn/web3-wallets"
                                 className="text-stone-600 hover:text-stone-900 transition-colors"
                                 target="_blank"
                                 rel="noopener noreferrer"
                              >
                                 Help
                              </a>
                           </li>
                           <li>
                              <InternalLink
                                 href="/partners"
                                 plain={crossDocumentLinks}
                                 className="text-stone-600 hover:text-stone-900 transition-colors"
                              >
                                 Partners
                              </InternalLink>
                           </li>
                        </ul>
                     </div>

                     {/* Other Links */}
                     <div>
                        <h3 className="text-lg font-semibold text-stone-800 mb-4">
                           Other Links
                        </h3>
                        <ul className="space-y-2">
                           <li>
                              <InternalLink
                                 href="/donate"
                                 plain={crossDocumentLinks}
                                 className="text-stone-600 hover:text-stone-900 transition-colors"
                              >
                                 Donate
                              </InternalLink>
                           </li>
                           <li>
                              <InternalLink
                                 href="/distribution"
                                 plain={crossDocumentLinks}
                                 className="text-stone-600 hover:text-stone-900 transition-colors"
                              >
                                 Insights
                              </InternalLink>
                           </li>
                           <li>
                              <InternalLink
                                 href="/profile"
                                 plain={crossDocumentLinks}
                                 className="text-stone-600 hover:text-stone-900 transition-colors"
                              >
                                 Profile
                              </InternalLink>
                           </li>
                        </ul>
                     </div>

                     {/* Social Links */}
                     <div>
                        <h3 className="text-lg font-semibold text-stone-800 mb-4">
                           Social Links
                        </h3>
                        <ul className="space-y-2">
                           <li>
                              <a
                                 href="https://x.com/summitshare_zm"
                                 className="text-stone-600 hover:text-stone-900 transition-colors"
                                 target="_blank"
                                 rel="noopener noreferrer"
                              >
                                 X
                              </a>
                           </li>
                           <li>
                              <a
                                 href="https://github.com/SummitShare"
                                 className="inline-flex items-center space-x-2 text-stone-600 hover:text-stone-900 transition-colors"
                                 target="_blank"
                                 rel="noopener noreferrer"
                              >
                                 <Github className="w-4 h-4" />
                                 <span>GitHub</span>
                              </a>
                           </li>
                           <li>
                              <a
                                 href="https://t.me/+X3VvXwhsHnEwNTc0"
                                 className="text-stone-600 hover:text-stone-900 transition-colors"
                                 target="_blank"
                                 rel="noopener noreferrer"
                              >
                                 Telegram
                              </a>
                           </li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>

            {/* Copyright Section */}
            <div className="border-t border-stone-200 pt-8 mt-8">
               <p className="text-sm text-stone-500 text-center">
                  © {new Date().getFullYear()} SummitShare. All rights reserved.
               </p>
            </div>
         </div>
      </footer>
   );
}

export default Footer;
