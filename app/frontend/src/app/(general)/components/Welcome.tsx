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

            <H3 text="NEWS 26/08"/>
			<p>Newly implemented on the frontend side:</p>
			<li>Login ans Signup have their own page. In theory pages don't get loaded if they won't be shown fast now.</li>
			<li>Layout split over general and authentication layout.</li>
			<li>Game does not use sessionStorage userId but currentUser.id</li>
			<li>A lot of files moved from their original location</li>

			<H3 text="BUG"/>
			<li>When you reload the page after finishing a game you get logged out sometimes. I don't know why this happpens.</li>
        </>
	);
}
