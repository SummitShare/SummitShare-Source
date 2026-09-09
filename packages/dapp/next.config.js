/** @type {import('next').NextConfig} */

const nextConfig = {
   images: {
      remotePatterns: [
         { protocol: 'https', hostname: 'images.unsplash.com' },
         { protocol: 'https', hostname: 'unsplash.com' },
         { protocol: 'https', hostname: 'plus.unsplash.com' },
         { protocol: 'https', hostname: 'loremflickr.com' },
         { protocol: 'https', hostname: 'images.squarespace-cdn.com' },
         { protocol: 'https', hostname: 'source.unsplash.com' },
         { protocol: 'https', hostname: '*.amazonaws.com' },
         { protocol: 'https', hostname: 'ethereum.org' },
         { protocol: 'https', hostname: 's3.tebi.io' },
         {
            protocol: 'https',
            hostname: 'pub-a2d19ba4b3934be7a05aa694f8e6618c.r2.dev',
         },
         { protocol: 'https', hostname: 'optimistic.etherscan.io' },
      ],
   },
   // No `env` block, deliberately. Next inlines every key listed there as a
   // literal into the client bundle at build time, with no NEXT_PUBLIC_ prefix
   // required — so it is not a server-config mechanism.
   //
   // Server code does not need it: API routes and server components read the
   // real `process.env` directly. Anything the browser genuinely needs is
   // named NEXT_PUBLIC_*.
   //
   // scripts/lib/clientEnvExposure.test.mjs guards this.
   // Empty turbopack config to silence Next.js 16 warning
   turbopack: {},
   webpack: (config, { isServer }) => {
      config.ignoreWarnings = [
         {
            message:
               /Attempted import error: 'sRGBEncoding' is not exported from 'three'/,
         },
         {
            message:
               /Attempted import error: 'PlaneBufferGeometry' is not exported from 'three'/,
         },
         {
            message:
               /Attempted import error: 'CylinderBufferGeometry' is not exported from 'three'/,
         },
      ];
      return config;
   },
};

module.exports = nextConfig;
