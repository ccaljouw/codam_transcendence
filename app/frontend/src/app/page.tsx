"use client"

import Welcome from "../components/Welcome.tsx";
import Leaderboard from '../components/Leaderboard.tsx';
import { useEffect, useState } from "react";
import { transcendenceSocket } from "../globals/socket.globalvar.tsx";
import UserList from "src/components/UserList.tsx";
import { UserProfileDto } from "../../../backend/src/users/dto/user-profile.dto.ts";

export default function Page() {
	const [username, setUsername] = useState('');
	useEffect(() => {
		console.log("connector called");
		transcendenceSocket.connect();
	},[])

	function setCurrentUserDisplayFunc(user: UserProfileDto) {
		return (
			<li key={user.id} onClick={() => { sessionStorage.setItem('userId', user.id.toString()); setUsername(user.loginName); console.log(`User set to ${user.id}`) }}>
				{user.firstName} {user.lastName} - {user.email}
			</li>
		)
	}

	return (
		<>
			<div>
				<br />
				<h1>Home page</h1>
				<p>Here you can see the welcome text, leaderboard and users. Chat on the bottom. For now, you can also select a username from the list</p>
				<br />
				{sessionStorage.getItem('userId') == null ?

				(<UserList userDisplayFunction={setCurrentUserDisplayFunc} />)
				:
				 (<Welcome name={username} />) }
				<br />
					<div className="row">
						<div className="col-sm-6">
						</div>
						<div className="col-sm-6">
						<Leaderboard />
						</div>
					</div>
				<br />
				{/* <Chat /> */}
			</div>
		</>
	);
}
