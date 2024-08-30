/** @type {import('next').NextConfig} */

const nextConfig = {
  // export is required by Capacitor
  output: "export",
  images: {
    unoptimized: true,
  },
  // webpack(config) {
  //   config.module.rules.push({
  //     test: /\.svg$/,
  //     use: ["@svgr/webpack"],
  //   });

  //   return config;
  // },

  // webpack: (config, { isServer, dev }) => {
  //   if (!dev && !isServer) {
  //     // enable source map to show hidden bugs
  //     config.devtool = "source-map";
  //   }
  //   return config;
  // },
};

module.exports = nextConfig;
