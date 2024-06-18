"use client";
import { useContext } from "react";
import { TranscendenceContext } from "@ft_global/contextprovider.globalvar";
import { H3 } from "src/globals/layoutComponents/Font";

export default function Welcome() : JSX.Element {
	const {currentUser} = useContext(TranscendenceContext);
	
	return (
		<>
            <H3 text="Welcome {currentUser.userName},"/>
            <p>Challenge your friends to play pong and make new ones on the way!</p>

            <H3 text="NEWS 07/06"/>
			<p>Newly implemented on the frontend side:</p>
			<li>Chat has white boxes around it</li>
			<li>Possible to change user settings on your profile page when you fill in a correct value</li>
        </>
	);
}
