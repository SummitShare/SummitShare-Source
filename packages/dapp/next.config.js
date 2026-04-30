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
   env: {
      RPC_URL: process.env.RPC_URL,
      DEV_PRIVATE_KEY: process.env.DEV_PRIVATE_KEY,
   },
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
