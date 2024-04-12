import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { constants } from '@ft_global/constants.globalvar';
import useAuthentication from '@ft_global/functionComponents/useAuthentication';

export default function CheckAlreadyLoggedIn() : JSX.Element{
	const { loginUser } = useAuthentication();
	const codeFromUrl = useSearchParams().get('code');

	useEffect (() => {
		const idFromStorage = sessionStorage.getItem('userId');

		if (idFromStorage != null)
			loginUser(constants.API_USERS + idFromStorage);
		if (codeFromUrl != null)
			loginUser(constants.API_AUTH42 + codeFromUrl);
	}, []);

    return (<></>);
}
