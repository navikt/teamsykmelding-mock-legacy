/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    eslint: {
        dirs: ['src'],
    },
}

module.exports = nextConfig
