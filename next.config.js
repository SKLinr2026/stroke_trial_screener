/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/stroke_trial_screener",
  trailingSlash: true,
  images: { unoptimized: true },
};

module.exports = nextConfig;
