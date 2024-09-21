"use client";
import { useContext, useEffect, useState } from "react";
import { UserProfileDto } from "@ft_dto/users";
import { TranscendenceContext } from "../contextprovider.globalvar";
import useFetch from "./useFetch";
import { usePathname, useRouter } from "next/navigation";
import { constants } from "../constants.globalvar";

type authenticationOutput = {
	user: UserProfileDto | null,
	fetchUserById: (url: string) => void,
	storeUser: (loggedInUser: UserProfileDto) => void,
}

export default function useAuthentication() : authenticationOutput {
	const {setCurrentUser} = useContext(TranscendenceContext);
	const [user, setUser] = useState<UserProfileDto | null>(null);
	const {data: fetchedUser, error, fetcher: userFetcher} = useFetch<null, UserProfileDto>();
	const [idFromStorage, setIdFromStorage] = useState<string | null>(null);
	const router = useRouter();
	const pathname = usePathname();

	useEffect (() => {
		const id = sessionStorage.getItem('userId');
		if (id != null)
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
		console.log("fetching user");
		await userFetcher({url: url});
	};

	useEffect(() => {
		if (fetchedUser != null)
		{
			console.log("storing user");
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
			sessionStorage.setItem('userId', JSON.stringify(user.id));
		}
	};

	const storeUser = (loggedInUser: UserProfileDto) : void => {
		setUser(loggedInUser);
		setCurrentUser(loggedInUser);
		setSessionStorage(loggedInUser);
		if (pathname == '/login' || pathname == '/signup' || pathname == '/auth')
		{
			router.push('/');
		}
	}

	return ({ user, fetchUserById, storeUser });
}
