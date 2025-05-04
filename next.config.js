/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add a rule to handle the undici module
    config.module.rules.push({
      test: /node_modules\/undici/,
      use: {
        loader: 'ignore-loader'
      }
    });

    // Add undici to externals
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'undici': false
      };
    }

    return config;
  },
  // Enable static optimization
  reactStrictMode: true,
  swcMinify: true,
  // Configure output
  output: 'standalone',
  // Configure images
  images: {
    domains: ['lecturer.vercel.app'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig 