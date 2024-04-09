import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { constants } from '@ft_global/constants.globalvar';

export default function Auth42Button() : JSX.Element {
    const pathname = usePathname();
    console.log(encodeURIComponent(pathname));
    console.log(`${constants.API_LOGIN_42}&redirect_uri=${encodeURIComponent(constants.FRONTEND_BASEURL + pathname)}&response_type=code`);

    return (
        <>
            {/* <Link className="btn btn-primary" href={"#"}>Login with 42</Link> */}
            <Link className="btn btn-primary" href={"https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-66c50cf4e54a51062bc5f0c110035ff12e1b0427cc1066c11d6e5c220a2ed1dc&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code"}>Login with 42</Link>
        </>
    );
}
