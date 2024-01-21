const path = require('path')

const isCompress = process.env.COMPRESS === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Handled by proxy
  compress: isCompress,
  eslint: {
    // Already run as a separate build step
    ignoreDuringBuilds: true,
  },
  async headers() {
    return process.env.NODE_ENV !== 'development'
      ? []
      : [
        {
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*',
            },
          ],
          source: '/:any*',
        },
      ];
  },
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'scss')],
  },
  transpilePackages: [
    'react-hook-form',
  ],
  typescript: {
    // Already run as a separate build step
    ignoreBuildErrors: true,
  },
  webpack: (webpackConfig, { webpack }) => {
    // Use `clsx` as a faster drop-in replacement for `classnames`
    // Alias `classnames` to `clsx` since it's used by `react-slick`
    // const { alias } = webpackConfig.resolve;
    // alias.classnames = 'clsx';

    webpackConfig.module.rules.push({
      loader: 'ignore-loader',
      test: /\.test\./,
    });

    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
      }),
    );

    return webpackConfig;
  },
};

module.exports = nextConfig
