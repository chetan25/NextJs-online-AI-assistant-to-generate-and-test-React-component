/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // matching all API routes
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          // { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          // {
          //   key: "Access-Control-Allow-Methods",
          //   value: "GET,DELETE,PATCH,POST,PUT",
          // },
          // {
          //   key: "Access-Control-Allow-Headers",
          //   value:
          //     "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          // },
        ],
      },
    ];
  },
};

export default nextConfig;
