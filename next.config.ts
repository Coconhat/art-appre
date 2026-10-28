import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is prerendered and nothing needs a server, so the site builds to plain files
  // in out/. Any static host can serve it, and a deploy carries no serverless functions.
  // (Cache Components / partial prerendering cannot run in export mode, so they stay off.)
  output: "export",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
