import type { NextConfig } from 'next'

const nextConfig = {
	reactStrictMode: false,
	headers: async () => {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'no-cache, no-store, must-revalidate',
					},
				],
			},
		];
	},
	exerimental: { appDir: true }
};

export default nextConfig;
