import React from "react";
import MenuBar from "../Components/MenuBar/MenuBar.tsx";
import Profile from "../Components/Profile/ProfilePage.tsx";
import Settings from "../Components/Settings/Settings.tsx";
import Chat from "../Components/Chat/Chat.tsx";

export default function App() {
	return (
		<>
		<div className={"transcendence-SignUp"}>
			<MenuBar />
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
