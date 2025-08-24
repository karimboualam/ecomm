// @ts-check
const { withNx } = require('@nx/next');

const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.pexels.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};

module.exports = withNx(nextConfig);
