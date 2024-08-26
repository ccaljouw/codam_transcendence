"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProfileDto } from "@ft_dto/users";
import { TranscendenceContext } from "@ft_global/contextprovider.globalvar";
import { transcendenceSocket } from "@ft_global/socket.globalvar"

export default function Logout() : JSX.Element {
	const { setCurrentUser } = useContext(TranscendenceContext);
	const router = useRouter();

	useEffect(() => {
		console.log("Logging out now");
		sessionStorage.clear();
		setCurrentUser({} as UserProfileDto);
		transcendenceSocket.disconnect();
		router.push('/login');
		transcendenceSocket.connect();
	},[]);

	return (
		<>	
			<p>Logging out...</p>
		</>
	);
}
