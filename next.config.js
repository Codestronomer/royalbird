/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'velgg90lgs.ufs.sh',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com'
      },
      {
        protocol: 'https',
        hostname: 'globalcomix-comics-assets-files-desktop.nyc3.cdn.digitaloceanspaces.com'
      }
    ],
  },
  serverExternalPackages: ['shiki'],
  reactStrictMode: true,
  transpilePackages: ['@uiw/react-md-editor', '@uiw/react-markdown-preview'],
}

export default nextConfig;