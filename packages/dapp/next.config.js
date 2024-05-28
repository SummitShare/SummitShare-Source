/** @type {import('next').NextConfig} */
require('dotenv').config();

const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      "images.unsplash.com",
      "unsplash.com",
      "plus.unsplash.com",
      "loremflickr.com",
      "images.squarespace-cdn.com",
      'source.unsplash.com'
    ],
  },
  env: {
    HACKMD_API_TOKEN: process.env.HACKMD_API_TOKEN,
    RPC_URL: process.env.RPC_URL,
    DEV_PRIVATE_KEY: process.env.DEV_PRIVATE_KEY,
  },
};

module.exports = nextConfig;
