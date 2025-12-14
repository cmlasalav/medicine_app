const path = require("path");

const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: isProd ? "/medicine_app" : "",
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
