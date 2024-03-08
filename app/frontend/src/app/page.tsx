"use client"
import Welcome from "./components/Welcome.tsx";
import Leaderboard from './components/Leaderboard.tsx';
import Users from "./components/Users.tsx";
import { useContext, useEffect, useState } from "react";
import { UserProfileDto } from "../../../backend/src/users/dto/user-profile.dto.ts";
import { constants } from "src/globals/constants.globalvar.tsx";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar.tsx";

export default function Page() {
	const {someUserUpdatedTheirStatus, currentUserId, setCurrentUserId, currentUserName, setCurrentUserName} = useContext(TranscendenceContext);

	useEffect(() => {
		if (typeof window !== 'undefined' && sessionStorage && sessionStorage.getItem != null) {
			const loginNameFromSession = sessionStorage.getItem('loginName');
			const userIdFromSession = sessionStorage.getItem('userId');
			if (loginNameFromSession && loginNameFromSession != '')
			{
				setCurrentUserName(loginNameFromSession);
			}
			if (userIdFromSession && userIdFromSession != '')
			{
				setCurrentUserId(parseInt(userIdFromSession));
				if ((!loginNameFromSession || loginNameFromSession == '') && currentUserId != 0)
					fetchUserName(currentUserId.toString());
			}
		}
	}, [currentUserName, someUserUpdatedTheirStatus]);

	const fetchUserName = async (id: string | null) =>
	{
		console.log(`fetching user for id [${id}]`);
		if (!id || id == '' || id == '0')
			return ;	
		const response = await fetch(constants.BACKEND_ADRESS_FOR_WEBSOCKET + 'users/' + id);
		const responseJSON : UserProfileDto = await response.json();
		const userNameFromDb = responseJSON.loginName;
		setCurrentUserName(userNameFromDb);
	}

	return (
		<>
			<div>
				<div className="row">
					<div className="col col-12">
						<Welcome name={currentUserName} />
					</div>
					<div className="col col-12 col-lg-6">
						<Leaderboard />
					</div>
					<div className="col col-12 col-lg-6">
						<Users />
					</div>
				</div>
			</div>
		</>
	);
}
