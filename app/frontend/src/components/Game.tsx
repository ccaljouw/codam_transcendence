"use client";
import { Game } from "../Game/components/Game.tsx";
import { useRef, useEffect, useState } from 'react';

export default function GameComponent() {
	const [game, setGame] = useState< Game | null >(null);
	const canvasRef = useRef< HTMLCanvasElement | null >(null);

	useEffect(() => {
		if (!game) {
			setGame(new Game(canvasRef.current!));
		}
	}, []); // canvasRef not needed? [canvasRef]

	useEffect(() => {
		if (game) {
			game.startGame();

		}
	}, [game]);

	return (
		<>
			<div className="row d-flex justify-content-center">
				<div className="component game game-component col-lg-9">
					<canvas ref={canvasRef} />
				</div>
			</div>
		</>
	);
}
