/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: isGithubPages ? "/stroke_trial_screener" : "",
  trailingSlash: true,
  images: { unoptimized: true },
};

module.exports = nextConfig;
