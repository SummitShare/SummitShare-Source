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
   // No `env` block. Next inlines every key here as a literal into the CLIENT
   // bundle at build time — that is what the block is for, and it needs no
   // NEXT_PUBLIC_ prefix to do it. `DEV_PRIVATE_KEY` was listed here and was
   // reaching the browser: `contractInit.ts` imports `walletInit.ts` for its
   // addresses and ABIs, which puts the `process.env.DEV_PRIVATE_KEY`
   // reference in the client graph, so the value was emitted verbatim into the
   // chunk that loads on /escrow.
   //
   // Server code does not need this block: API routes and server components
   // read the real `process.env` directly. Anything the browser genuinely needs
   // must be named NEXT_PUBLIC_* and must not be a secret.
   //
   // scripts/lib/clientEnvExposure.test.mjs fails the build-gate if a
   // secret-shaped name is reintroduced here.
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
