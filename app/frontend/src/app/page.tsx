import React from 'react';
import MenuBar from "./Components/MenuBar/MenuBar.tsx";
import Welcome from "./Components/Welcome/Welcome.tsx";
import Chat from './Components/Chat/Chat.tsx';
import Leaderboard from './Components/Leaderboard/Leaderboard.tsx';
import Users from './Components/Users/Users.tsx';

export default function App() {
	return (
		<div className={"transcendence-Home"}>
			<MenuBar />
			<br />
			<h1>Home page</h1>
			<p>Here you can see the welcome text, leaderboard and users. Temp also: Settings and Chat</p>
			<br />
			<Welcome />
			<br />
			<Leaderboard />
			<br />
			<Users />
			<br />
			<Chat />
		</div>
	);
}
