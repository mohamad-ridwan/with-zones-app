/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "/blog-static",
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/blog-static/_next/:path+",
          destination: "/_next/:path+",
        },
      ],
    };
  },
};

module.exports = nextConfig;
