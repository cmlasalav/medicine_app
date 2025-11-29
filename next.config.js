const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "dist",
  images: {
    unoptimized: true,
  },
  webpack(config) {
    config.resolve.alias["@components"] = path.join(__dirname, "components");
    return config;
  },
};

module.exports = nextConfig;
