module.exports = {
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_LIFF_ID:process.env.NEXT_PUBLIC_LIFF_ID

  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://traffy-data.vercel.app/:path*', // Proxy to Backend
      },
    ];
  },
  images: {
    domains: [
      'maps.googleapis.com', 
      'tailwindui.com', 
      'www.thaitravelcenter.com'
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/public/uploads/**',
      },
    ],
    unoptimized: true,
  },
};
