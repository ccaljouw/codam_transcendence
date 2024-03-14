"use client";
import { useRef, useEffect, useState } from 'react';
import styles from '../styles.module.css';
import {transcendenceSocket} from '@global/vars'; // websocket global
import { Game } from "../../../Game/components/Game.tsx";


// assign global websocket to local var for clarity
const gameSocket = transcendenceSocket;

export default function GameComponent() {
	const [game, setGame] = useState< Game | null >(null);
	const canvasRef = useRef< HTMLCanvasElement | null >(null);

	useEffect(() => {
		if (!game) {
			setGame(new Game(canvasRef.current!));
		}

		// websocket test stuff //
		gameSocket.connect(); // this oughta be done on signin, but it doesn't hurt to do it twice as it will be ignored when there is already a connection
		gameSocket.emit('game/message', "hooi");
		gameSocket.on('game/message', (msg:string) => { // listen to 'game/message'
			console.log(`got message ${msg}`);
		})
		// end websocket test stuff //
		return () =>
		{
			gameSocket.off('game/message'); // removes the listener. NB: remove all listeners or the compent will not return this function cleanly.
		}
	}, []); // canvasRef not needed? [canvasRef]

	useEffect(() => {
		if (game) {
			game.startGame();

		}
	}, [game]);

	return (
		<>
			<div className={styles.game}>
				<canvas ref={canvasRef} />
			</div>
		</>
	);
}
