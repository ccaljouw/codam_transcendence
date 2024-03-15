"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProfileDto } from "@dto/users";
import { TranscendenceContext } from "@global/contextprovider.globalvar";
import { transcendenceSocket } from "@global/socket.globalvar"

export default function Logout(): JSX.Element {
    const { setCurrentUser } = useContext(TranscendenceContext);
    const router = useRouter();

    useEffect(() => {
        console.log("Logging out now");
        sessionStorage.clear();
		setCurrentUser({} as UserProfileDto);
		transcendenceSocket.disconnect();
        router.push('/');
		transcendenceSocket.connect();
    },[]);

    return (
        <>	
            <p>Logging out...</p>
        </>
    );
}
