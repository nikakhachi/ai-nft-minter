/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    IPFS_PROJECT_ID: process.env.IPFS_PROJECT_ID,
    IPFS_PROJECT_SECRET: process.env.IPFS_PROJECT_SECRET,
    STABILITY_API_KEY: process.env.STABILITY_API_KEY,
  },
};

module.exports = nextConfig;
