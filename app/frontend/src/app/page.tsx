"use client"

import Welcome from "./components/Welcome.tsx";
import Leaderboard from './components/Leaderboard.tsx';
import Users from "./components/Users.tsx";
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
				<div className="row">
					<div className="col col-12">
						{sessionStorage.getItem('userId') == null ?
							(<UserList userDisplayFunction={setCurrentUserDisplayFunc} />)
							:
				 			(<Welcome name={username} />) }
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
