"use client";
import { Game } from "../Game/components/Game.tsx";
import { useRef, useEffect, useState } from 'react';

export default function GameComponent() {
	const [game, setGame] = useState<Game | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (!game) {
			setGame(new Game(canvasRef.current!));
		}
	}, [canvasRef]);

	useEffect(() => {
		if (game) {
				game.startGame();
			}
	}, [game]);

	return (
		<div className="component">
			<canvas ref={canvasRef}/>
		</div>
	);
}
