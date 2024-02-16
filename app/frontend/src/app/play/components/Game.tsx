"use client";
import { useRef, useEffect, useState } from 'react';
import { Game } from "../../../Game/components/Game.tsx";
import styles from '../styles.module.css';

export default function GameComponent() {
	const [game, setGame] = useState< Game | null >(null);
	const canvasRef = useRef< HTMLCanvasElement | null >(null);

	useEffect(() => {
		if (!game) {
			setGame(new Game(canvasRef.current!));
		}
	}, []);

	useEffect(() => {
		if (game) {
			game.startGame();

		}
	}, [game]);

	return (
		<>
			<div className={styles.game}>
				{/* <h1>Game page</h1>
				<p>Here you can play a game and chat</p> */}
				<canvas ref={canvasRef} />
			</div>
		</>
	);
}
