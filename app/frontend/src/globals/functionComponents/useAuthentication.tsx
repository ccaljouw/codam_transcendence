import { useContext, useEffect, useState } from "react";
import { UserProfileDto } from "@ft_dto/users";
import { TranscendenceContext } from "../contextprovider.globalvar";
import useFetch from "./useFetch";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { constants } from "../constants.globalvar";

type authenticationOutput = {
	user: UserProfileDto | null,
	loginUser: (url: string) => void,
	storeUser: (user: UserProfileDto) => void,
}

export default function useAuthentication() : authenticationOutput {
	const { currentUser, setCurrentUser } = useContext(TranscendenceContext);
	const params = useSearchParams();
	const userFromUrl = params.get('user');
	const {data: user, fetcher: userFetcher} = useFetch<null, UserProfileDto>();
	const [idFromStorage, setIdFromStorage] = useState<string | null>(null);
	const router = useRouter();
	const pathname = usePathname();

	useEffect (() => {
		const id = sessionStorage.getItem('userId');
		if (id != null)
		{
			setIdFromStorage(id);
			console.log("user already logged in, fetching user " + id);
			loginUser(constants.API_USERS + id);
		}
		if (userFromUrl != null)
		{
			loginUser(constants.API_USERS + userFromUrl);
			router.push(pathname);
		}
	}, []);

	const loginUser = (url: string) : void  => {
		userFetcher({url: url});
	};

	useEffect(() => {
		if (user != null)
			storeUser(user);
	}, [user]);

	const storeUser = (user: UserProfileDto) : void  => {
		console.log(`Setting user with id ${user.id} and in useAuthentication`);
		if (currentUser != user)
		{
			console.log("updating currentUser from useAuthentication")
			setCurrentUser(user);
		}
		if (idFromStorage == null || +idFromStorage != user.id)
		{
			console.log("updating sessionStorage from useAuthentication")
			sessionStorage.setItem('userId', JSON.stringify(user.id));
		}
	};

	return ({ user, loginUser, storeUser });
}
