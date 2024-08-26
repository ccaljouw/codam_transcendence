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
		if (auth42Status != null) {
			setAuth42Error(`${auth42Status}: ${auth42Message}`);
			router.push(pathname);
		}
		else
			router.push('/');
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
