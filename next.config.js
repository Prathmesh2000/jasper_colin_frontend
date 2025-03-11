/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  env: {
    BASE_URL: 'http://localhost:4002',
    JWT_SECRET_AUTH: process.env.JWT_SECRET

  }
}

module.exports = nextConfig
