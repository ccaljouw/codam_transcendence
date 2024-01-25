import React from 'react';
import MenuBar from "./Components/MenuBar/MenuBar.tsx";
import SignUp from "./Components/SignUp/SignUp.tsx";
import Welcome from "./Components/Welcome/Welcome.tsx";
import GameComponent from './Components/Game/Game.tsx';
import Chat from './Components/Chat/Chat.tsx';
import Leaderboard from './Components/Leaderboard/Leaderboard.tsx';
import Settings from './Components/Settings/Settings.tsx';
import Users from './Components/Users/Users.tsx';

export default function App() {
	return (
		<>
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
			<Settings />
			<br />
			<Chat />
		</div>
		</>
	);
}
