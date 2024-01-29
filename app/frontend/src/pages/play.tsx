// import React from "react"; // This is not used
import GameComponent from "../Components/Game.tsx";
import Chat from "../Components/Chat.tsx";

export default function App() {
	return (
		<>
			<div className="transcendence-Game">
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
