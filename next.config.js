const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
})
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const million = require('million/compiler')

const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@studio-freight/compono'],
  experimental: {
    optimizeCss: true,
    nextScriptWorkers: true,
    urlImports: ['https://cdn.skypack.dev', 'https://unpkg.com'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
  images: {
    // ADD in case you need to import SVGs in next/image component
    // dangerouslyAllowSVG: true,
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
      {
        protocol: 'https',
        hostname: 'assets.studiofreight.com',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // add @import 'styles/_functions'; to all scss files.
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import 'styles/_functions';`,
  },
  webpack: (config, options) => {
    const { dir } = options

    config.module.rules.push(
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              memo: true,
              dimensions: false,
              svgoConfig: {
                multipass: true,
                plugins: [
                  'removeDimensions',
                  'removeOffCanvasPaths',
                  'reusePaths',
                  'removeElementsByAttr',
                  'removeStyleElement',
                  'removeScriptElement',
                  'prefixIds',
                  'cleanupIds',
                  {
                    name: 'cleanupNumericValues',
                    params: {
                      floatPrecision: 1,
                    },
                  },
                  {
                    name: 'convertPathData',
                    params: {
                      floatPrecision: 1,
                    },
                  },
                  {
                    name: 'convertTransform',
                    params: {
                      floatPrecision: 1,
                    },
                  },
                  {
                    name: 'cleanupListOfValues',
                    params: {
                      floatPrecision: 1,
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(graphql|gql)$/,
        include: [dir],
        exclude: /node_modules/,
        use: [
          {
            loader: 'graphql-tag/loader',
          },
        ],
      },
    )

    // config.resolve.alias = {
    //   ...config.resolve.alias,
    //   '@studio-freight/hamo': path.resolve(
    //     __dirname,
    //     'node_modules/@studio-freight/hamo'
    //   ),
    // }

    return config
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
  redirects: async () => {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/capabilities',
        destination: '/StudioFreight-Capabilities.pdf',
        permanent: true,
      },
    ]
  },
}

const nextConfigWrapper = () => {
  const plugins = [withPWA, withBundleAnalyzer]
  return plugins.reduce((acc, plugin) => plugin(acc), {
    ...nextConfig,
  })
}

const millionConfig = {
  auto: true,
  // if you're using RSC:
  // auto: { rsc: true },
}

module.exports = million.next(nextConfigWrapper(), millionConfig)
