import GameComponent from "../../components/Game.tsx";
import Chat from "../../components/Chat.tsx";

export default function Page() {
	return (
		<>
			<div className="transcendenceGame">
				<h1>Game page</h1>
				<p>Here you can play a game and chat</p>
				<GameComponent />
				<br />
				<Chat />
			</div>
		</>
	);
}
