"use client";
import { useContext } from "react";
import { TranscendenceContext } from "@ft_global/contextprovider.globalvar";
import { FontBangers } from "src/globals/layoutComponents/Font";

export default function Welcome() : JSX.Element {
	const {currentUser} = useContext(TranscendenceContext);
	
	return (
		<>
			<FontBangers>
            	<h3>Welcome {currentUser.userName},</h3>
			</FontBangers>
            <p>Challenge your friends to play pong and make new ones on the way!</p>
        </>
	);
}
