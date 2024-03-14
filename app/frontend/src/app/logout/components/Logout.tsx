"use client";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar";
import { UserProfileDto } from "../../../../../backend/src/users/dto/user-profile.dto";
import { transcendenceSocket } from "src/globals/socket.globalvar";

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
