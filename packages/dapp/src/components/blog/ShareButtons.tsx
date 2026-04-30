'use client';

import { CheckIcon, LinkIcon, TwitterIcon } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
   title: string;
   slug: string;
}

const ShareButtons = ({ title, slug }: ShareButtonsProps) => {
   const [copied, setCopied] = useState(false);

   const url =
      typeof window !== 'undefined'
         ? window.location.href
         : `https://summitshare.co/blog/${slug}`;

   const copy = async () => {
      try {
         await navigator.clipboard.writeText(url);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      } catch {
         /* clipboard unavailable — silently ignore */
      }
   };

   const tweetHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
   )}&url=${encodeURIComponent(url)}`;

   return (
      <div className="flex flex-wrap items-center gap-2">
         <span className="text-sm font-medium text-neutral-600">Share</span>
         <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-full border border-orange-600/30 bg-white px-3 py-1.5 text-xs font-semibold text-orange-900 transition-colors hover:bg-orange-50"
         >
            {copied ? (
               <>
                  <CheckIcon className="h-3.5 w-3.5" />
                  Copied
               </>
            ) : (
               <>
                  <LinkIcon className="h-3.5 w-3.5" />
                  Copy link
               </>
            )}
         </button>
         <a
            href={tweetHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-orange-600/30 bg-white px-3 py-1.5 text-xs font-semibold text-orange-900 transition-colors hover:bg-orange-50"
         >
            <TwitterIcon className="h-3.5 w-3.5" />
            Post on X
         </a>
      </div>
   );
};

export default ShareButtons;
