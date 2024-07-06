/** @type {import('next').NextConfig} */
require('dotenv').config();

const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'unsplash.com',
      'plus.unsplash.com',
      'loremflickr.com',
      'images.squarespace-cdn.com',
      'source.unsplash.com',
      'hackmd.io',
      'amazonaws.com',
      'ethereum.org',
      's3.tebi.io'
    ],
  },
  env: {
    HACKMD_API_TOKEN: process.env.HACKMD_API_TOKEN,
    RPC_URL: process.env.RPC_URL,
    DEV_PRIVATE_KEY: process.env.DEV_PRIVATE_KEY,
  },
  webpack: (config, { isServer }) => {
    config.ignoreWarnings = [
      { message: /Attempted import error: 'sRGBEncoding' is not exported from 'three'/ },
      { message: /Attempted import error: 'PlaneBufferGeometry' is not exported from 'three'/ },
      { message: /Attempted import error: 'CylinderBufferGeometry' is not exported from 'three'/ },
    ];
    return config;
  },
};

module.exports = nextConfig;