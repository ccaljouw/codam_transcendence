import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { constants } from '@ft_global/constants.globalvar';
// import { env } from '../../../../../backend/.env';

export default function Auth42Button() : JSX.Element {
    const pathname = usePathname();
    console.log(encodeURIComponent(pathname));
    // console.log(`${constants.API_LOGIN_42}&redirect_uri=${encodeURIComponent(constants.FRONTEND_BASEURL + pathname)}&response_type=code`);

    return (
        <>
        {/* todo jma: use proper env variables to create url: */}
            <Link className="btn btn-primary" href={`https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-66c50cf4e54a51062bc5f0c110035ff12e1b0427cc1066c11d6e5c220a2ed1dc&redirect_uri=${encodeURIComponent(constants.FRONTEND_BASEURL + pathname)}&response_type=code`}>Login with 42</Link>
            {/* <Link className="btn btn-primary" href={`https://api.intra.42.fr/oauth/authorize?client_id=${env.CLIENT_ID}&redirect_uri=${encodeURIComponent(constants.FRONTEND_BASEURL + pathname)}&response_type=code&scope=${env.SCOPE}&state=${env.STATE}`}>Login with 42</Link> */}
            {/* <Link className="btn btn-primary" href={`${constants.API_LOGIN_42}&redirect_uri=${encodeURIComponent(constants.FRONTEND_BASEURL + pathname)}&response_type=code`}>Login with 42</Link> */}
        </>
    );
}
