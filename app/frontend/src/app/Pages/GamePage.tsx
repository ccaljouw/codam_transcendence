import { Game } from "../Game/components/Game.tsx";
import { useRef, useEffect, useState } from 'react';

function GameComponent() {
	const [game, setGame] = useState<Game | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	useEffect(() => {
		if (!game) {
			setGame(new Game(canvasRef.current));
		}
		// return () => {
		// 	if (game) {
		// 		game.resetGame();
		// 		setGame(null);
		// 	}
		// };

	}, [canvasRef]);

	useEffect(() => {
		if (game) {
			game.startGame();
		}
	}, [game]);

	return (
		<>
			<canvas ref={canvasRef}/>
		</>
	);
}

export default function GamePage() {
	return (
		<>
            <h1>Start a new game</h1>
            <GameComponent />
            <h1>Started a new game</h1>
		</>
	);
}
