"use client";
import { Game } from "../Game/components/Game.tsx";
import { useRef, useEffect, useState } from 'react';

export default function GameComponent() {
	const [game, setGame] = useState< Game | null >(null);
	const canvasRef = useRef< HTMLCanvasElement | null >(null);
	const [width, setWidth] = useState<number>(innerWidth);

	useEffect(() => {
		if (!game) {
			setGame(new Game(canvasRef.current!, width));
		}
	}, []); // canvasRef not needed? [canvasRef]

	useEffect(() => {
		if (game) {
			game.startGame();
		}
	}, [game]);

	useEffect(() => {		
		const handleResize = () => {
			setWidth(innerWidth);
			if (game){
				console.log("hoi");
				const scaleFactor = (innerWidth - width) / width;
				game.updateSize(scaleFactor);
			}
		};
		
		window.addEventListener("resize", handleResize);
	
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="component game">
			<canvas ref={canvasRef} />
		</div>
	);
}
