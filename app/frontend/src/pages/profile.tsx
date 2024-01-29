// import React from "react"; // This is not used
import Profile from "../Components/Profile.tsx";
import Settings from "../Components/Settings.tsx";
import Chat from "../Components/Chat.tsx";

export default function App() {
	return (
		<>
			<div className="transcendence-Profile">
				<br />
				<h1>Profile page</h1>
				<p>Here you can look at your profile and change settings</p>
				<Profile />
				<br />
				<Settings />
				<br />
				<Chat />
			</div>
		</>
	);
}
