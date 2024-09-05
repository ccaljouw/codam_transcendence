"use client";
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Page() : JSX.Element {
	const params = useSearchParams();
	const auth42Status = params.get('status');
	const auth42Message = params.get('message');
	const pathname = usePathname();
	const router = useRouter();
	const [auth42Error, setAuth42Error] = useState<String | null>(null);

	useEffect(() => {
		console.log(`status: ${auth42Status}`)
		if (auth42Status)
		{
			setAuth42Error(`${auth42Status}: ${auth42Message}`);
			router.push(pathname);
		}
	}, [auth42Status]);

	return (
		<>
			<div className="white-box">
				{auth42Error != null ?
					<p>Error logging in with Auth42: {auth42Error}</p>
					:
					<p>Logging in with Auth42 successful</p>
				}
			</div>
		</>
	);
}
