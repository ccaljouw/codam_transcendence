import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { constants } from '@ft_global/constants.globalvar';
import { useEffect } from 'react';

export default function Auth42Button() : JSX.Element {
	// const pathname = usePathname();
	{/* todo jma: use env variables to create url and clientId: */}
	const url = `https://api.intra.42.fr/oauth/authorize`;
	const clientId = `u-s4t2ud-66c50cf4e54a51062bc5f0c110035ff12e1b0427cc1066c11d6e5c220a2ed1dc`;
	// const redirectUri = encodeURIComponent(constants.FRONTEND_BASEURL + pathname); // todo: enable this to redirect to another page than home
	const redirectUri = encodeURIComponent(constants.FRONTEND_BASEURL);

	useEffect(() => {
		console.log(`${url}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`);
	}, []);

	return (
		<>
			<Link className="btn btn-primary" href={`${url}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`}>
				Continue with Auth42
			</Link>
		</>
	);
}
