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

			<H3 text="NEWS 11/09"/>
			<p>Newly implemented on the frontend side:</p>
			<li>Not found page added</li>
			<li>2FA login goes in 2 steps now</li>
			<li>2FA QR code is scalable</li>
			<li>Avatar is scalable</li>
			<li>For all files that I changed, I updated the tabs indentation to 2 tabs</li>
			<li>Almost ready: 42 user can not set 2FA or password</li>
			&nsbr;
			<H3 text="NEWS 13/09"/>
			<p>Newly implemented on the frontend side:</p>
			<li>We use 'npm run deploy' instead of 'npm run dev'</li>
			<li>42 user does not see options to change password or toggle 2FA</li>

		</>
	);
}
