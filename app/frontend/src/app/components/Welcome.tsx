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

			<FontBangers>
            	<h3>NEWS</h3>
			</FontBangers>
			<p>Newly implemented on the frontend side:</p>
			<li>Leaderboard pastes data from API call (currently API call for all users, this will be the call for the leaderboard)</li>
			<li>Profile page has the first achievements added. They are not stored in the database yet, but a testFunction shows them</li>
			<li>Click on an achievement to read the description</li>
			<li>User information and login information are merged</li>
			<li>It is possible to change some of your user information. Password and 2FA not implemented yet</li>
			<li>Friends amount is shown from the database</li>
        </>
	);
}
