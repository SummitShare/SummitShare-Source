/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      "images.unsplash.com",
      "unsplash.com,",
      "plus.unsplash.com",
      "loremflickr.com",
      "images.squarespace-cdn.com",
      'source.unsplash.com'
    ],
  },
};

module.exports = nextConfig;
