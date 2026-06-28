/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows all domains and hostnames
      },
      {
        protocol: 'http',
        hostname: '**', // Allows old or unsecure links if needed
      },
    ],
  },
};

export default nextConfig;
