/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    STABILITY_API_KEY: process.env.STABILITY_API_KEY,
    GOERLI_ALCHEMY_URL: process.env.GOERLI_ALCHEMY_URL,
    GOERLI_ALCHEMY_URL_WS: process.env.GOERLI_ALCHEMY_URL_WS,
  },
};

module.exports = nextConfig;
