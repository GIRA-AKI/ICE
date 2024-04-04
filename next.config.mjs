/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        KEYTOKEN: process.env.KEYTOKEN,
      },
    images: {
        domains : ['localhost'],
        remotePatterns: [
            {
                protocol:'https',
                hostname:'**'
            }
        ]
    },
};

export default nextConfig;
