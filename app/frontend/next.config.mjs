/** @type {import('next').NextConfig} */
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
	}
};

export default nextConfig;
