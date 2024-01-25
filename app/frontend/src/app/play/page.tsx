import React from "react";
import MenuBar from "../Components/MenuBar/MenuBar.tsx";
import GameComponent from "../Components/Game/Game.tsx";
import Chat from "../Components/Chat/Chat.tsx";

export default function App() {
	return (
		<>
		<div className="transcendence-Game">
			<MenuBar />
			<br />
			<h1>Game page</h1>
			<p>Here you can play a game and chat</p>
			<GameComponent />
			<br />
			<Chat />
		</div>
		</>
	);
}
