/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent webpack from trying to bundle server-only packages that use Node built-ins
  serverExternalPackages: ['@mendable/firecrawl-js', 'undici'],

  // Compress responses
  compress: true,

  // Recommended image formats
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // HTTP security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.voiceflow.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.voiceflow.com",
              "font-src 'self' https://fonts.gstatic.com https://cdn.voiceflow.com",
              "connect-src 'self' https://formspree.io https://general-runtime.voiceflow.com wss://general-runtime.voiceflow.com https://runtime-api.voiceflow.com wss://runtime-api.voiceflow.com https://api.voiceflow.com",
              "img-src 'self' data: blob: https://cdn.voiceflow.com https://*.s3.amazonaws.com",
              "frame-src 'none'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
}

export default nextConfig
