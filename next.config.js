/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ozctavzgkatiswmaokcz.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;