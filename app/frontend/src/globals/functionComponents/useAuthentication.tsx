import { useContext, useEffect } from "react";
import { UserProfileDto } from "@ft_dto/users";
import { TranscendenceContext } from "../contextprovider.globalvar";
import useFetch from "./useFetch";
import { useSearchParams } from "next/navigation";
import { constants } from "../constants.globalvar";

type authenticationOutput = {
	user: UserProfileDto | null,
	loginUser: (url: string) => void,
	storeUser: (user: UserProfileDto) => void,
}

export default function useAuthentication () : authenticationOutput {
	const { currentUser, setCurrentUser } = useContext(TranscendenceContext);
	const codeFromUrl = useSearchParams().get('code');
	const { data: user, fetcher: userFetcher } = useFetch<null, UserProfileDto>();
	const idFromStorage = sessionStorage.getItem('userId');

	useEffect (() => {

		if (idFromStorage != null)
			loginUser(constants.API_USERS + idFromStorage);
		if (codeFromUrl != null)
			loginUser(constants.API_AUTH42 + codeFromUrl);
	}, []);

	const loginUser = (url: string) : void  => {
		userFetcher({url: url});
	};

	useEffect(() => {
		if (user != null)
			storeUser(user);
	}, [user]);

	const storeUser = (user: UserProfileDto) : void  => {
		console.log("Setting user with id " + user.id + " in useAuthentication");
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
