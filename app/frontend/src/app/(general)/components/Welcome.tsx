"use client";
import { useContext } from "react";
import { TranscendenceContext } from "@ft_global/contextprovider.globalvar";
import { H3 } from "src/globals/layoutComponents/Font";

export default function Welcome() : JSX.Element {
	const {currentUser} = useContext(TranscendenceContext);
	
	return (
		<>
            <H3 text={`Welcome ${currentUser.userName},`}/>
            <p>Challenge your friends to play pong and make new ones on the way!</p>

            <H3 text="NEWS 04/09"/>
			<p>Newly implemented on the frontend side:</p>
			<li>Logout bug origin found and understood</li>
			<li>Change password works correctly</li>
			<li>Game does not use sessionStorage userId but currentUser.id</li>
			<li>Min and max values defined</li>
			<li>Seed done in package.json instead of login component</li>
			<li>Ladder positions shown on home page and profile page</li>
        </>
	);
}
