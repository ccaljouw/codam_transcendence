import { useContext, useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { UserProfileDto } from '@ft_dto/users';
import useFetch from '@ft_global/functionComponents/useFetch';
import { constants } from '@ft_global/constants.globalvar';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';

export default function CheckAlreadyLoggedIn() : JSX.Element{
	const {currentUser, setCurrentUser} = useContext(TranscendenceContext);
	const { data: user, fetcher: userFetcher } = useFetch<null, UserProfileDto>();
    const idFromSession = sessionStorage.getItem('userId');
	const code = useSearchParams().get('code');
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		if (idFromSession != null)
		{
			console.log("User already logged in. Id: " + idFromSession);
			if (Object.keys(currentUser).length == 0)
			{
				console.log("fetching user with id: " + idFromSession);
				fetchUser(constants.API_USERS + +idFromSession);
			}
		}
		else if (code != null)
		{
			console.log("User logged in with auth42. Code: " + code);
			fetchUser(constants.API_AUTH42 + code);
			router.push(pathname);
		}
	}, []);
	
	useEffect(() => {
		if (user != null)
		{
			setLoggedUser(user);
		}	
	}, [user]);	
	
	const  fetchUser = async (url: string) => {
		userFetcher({url: url});
	}
	
    const  setLoggedUser = (user: UserProfileDto) => {
		console.log("Setting user with id " + user.id + " in LoginScreen");
		setCurrentUser(user);
		sessionStorage.setItem('userId', JSON.stringify(user.id));
	}

    return (<></>);
}
