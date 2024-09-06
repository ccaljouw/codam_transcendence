"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProfileDto } from "@ft_dto/users";
import { TranscendenceContext } from "@ft_global/contextprovider.globalvar";
import { transcendenceSocket } from "@ft_global/socket.globalvar"
import useFetch from "src/globals/functionComponents/useFetch";
import { constants } from "src/globals/constants.globalvar";

export default function Logout() : JSX.Element {
	const { setCurrentUser } = useContext(TranscendenceContext);
	const router = useRouter();
	const {fetcher} = useFetch<null, null>();

	useEffect(() => {
		logout();
		console.log("Logging out now");
		sessionStorage.clear();
		setCurrentUser({} as UserProfileDto);
		transcendenceSocket.disconnect();
		router.push('/login');
		transcendenceSocket.connect();
	},[]);

	const logout = async () => {
		await fetcher({url: constants.API_LOGOUT, fetchMethod: "POST"});
	}

	return (
		<>	
			<p>Logging out...</p>
		</>
	);
}
