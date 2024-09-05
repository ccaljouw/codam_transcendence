import { useContext, useEffect, useState } from "react";
import { UserProfileDto } from "@ft_dto/users";
import { TranscendenceContext } from "../contextprovider.globalvar";
import useFetch from "./useFetch";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { constants } from "../constants.globalvar";

type authenticationOutput = {
	user: UserProfileDto | null,
	storeUser: (loggedInUser: UserProfileDto) => void,
}

export default function useAuthentication() : authenticationOutput {
	const {setCurrentUser} = useContext(TranscendenceContext);
	const params = useSearchParams();
	const userFromUrl = params.get('user');
	const [user, setUser] = useState<UserProfileDto | null>(null);
	const {data: fetchedUser, error, fetcher: userFetcher} = useFetch<null, UserProfileDto>();
	const [idFromStorage, setIdFromStorage] = useState<string | null>(null);
	const router = useRouter();
	const pathname = usePathname();

	useEffect (() => {
		const id = sessionStorage.getItem('userId');
		if (userFromUrl != null)
		{
			fetchUserById(constants.API_CHECK_ID + userFromUrl);
		}
		else if (id != null)
		{
			setIdFromStorage(id);
			console.log(`user already logged in, fetching user ${id}`);
			fetchUserById(constants.API_CHECK_ID + id);
		}
		else
		{
			if (pathname != '/login' && pathname != '/signup' && pathname != '/auth')
				router.push('/login');
		}
	}, []);

	const fetchUserById = async (url: string) : Promise<void>  => {
		await userFetcher({url: url});
	};

	useEffect(() => {
		if (fetchedUser != null)
		{
			storeUser(fetchedUser);
		}
	}, [fetchedUser]);

	useEffect(() => {
		if (error != null)
		{
			console.log(`Error authenticating in useAuthentication: ${error.name}: ${error.message}`);
			if (pathname != '/login' && pathname != '/signup' && pathname != '/auth')
				router.push('/login');
		}
	}, [error]);

	const setSessionStorage = (user: UserProfileDto) : void  => {
		if (user != null && (idFromStorage == null || +idFromStorage != user.id))
		{
			console.log("updating sessionStorage from useAuthentication")
			sessionStorage.setItem('userId', JSON.stringify(user.id));
		}
	};

	const storeUser = (loggedInUser: UserProfileDto) : void => {
		setUser(loggedInUser);
		setCurrentUser(loggedInUser);
		setSessionStorage(loggedInUser);
		if (pathname == '/login' || pathname == '/signup' || pathname == '/auth' || (userFromUrl && fetchedUser))
		{
			console.log(`pushing to '/' from useAuthentication`);
			router.push('/');
		}
	}

	return ({ user, storeUser });
}
