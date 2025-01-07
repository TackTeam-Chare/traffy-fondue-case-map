module.exports = {
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_LIFF_ID:process.env.NEXT_PUBLIC_LIFF_ID

  },
  images: {
    domains: [
      'maps.googleapis.com', 
      'tailwindui.com', 
      'www.thaitravelcenter.com'
    ],
    unoptimized: true,
  },
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],

};
