/** @type {import('next').NextConfig} */
const withImages = require('next-images');
const withSvgr = require('next-svgr');
const envEnc = require('@chainlink/env-enc')
envEnc.config();
const nextConfig = withSvgr(withImages({
  reactStrictMode: true,
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  env: {
    tempkey: process.env.PRIVATE_KEY
  }
}));

module.exports = nextConfig;
