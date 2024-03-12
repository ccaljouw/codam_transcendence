"use client";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar";

export default function Logout(): JSX.Element {
    const { setCurrentUserId, setCurrentUserName } = useContext(TranscendenceContext);
    const router = useRouter();

    useEffect(() => {
        console.log("Logging out now");
        sessionStorage.clear();
        setCurrentUserId(0);
        setCurrentUserName('');
        router.push('/');
        //todo: JMA: also log out in the database
    },[]);

    return (
        <>	
            <p>Logging out...</p>
        </>
    );
}
