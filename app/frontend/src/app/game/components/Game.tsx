"use client";
import { useRef, useEffect, useState } from 'react';
import { GameState } from '@prisma/client';
import { UpdateGameDto, updateGameStateDto } from '@ft_dto/game';
import { Game } from '../../../../../game/components/Game.tsx';
import { instanceTypes } from '../../../../../game/utils/constants.tsx';
import { transcendenceSocket } from '../../../globals/socket.globalvar.tsx'; // websocket global
import { constants } from '@ft_global/constants.globalvar.tsx';

export default function GameComponent() {
	const gameSocket = transcendenceSocket;
	const canvasRef = useRef< HTMLCanvasElement | null >(null);
	const userId  = sessionStorage.getItem('userId'); // todo: change to token
	const [game, setGame] = useState< Game | null >(null);
	const [gameData , setGameData] = useState<UpdateGameDto | null> (null);
	const [roomId, setRoomId] = useState<number>(0);
	const [gameReady, setGameReady] = useState<number>(0); //todo change
	const [gameState, setGameState] = useState<GameState>(GameState.WAITING);
	const [twoPlayersInGame, setTwoPlayersInGame] = useState<boolean>(false);
	const [instanceType, setInstanceType] = useState<instanceTypes>(instanceTypes.observer) // 0 for player 1, 1 for player 2, 2 for observer
	
	
	// fetch game data
	useEffect(() => {
		if (userId) {
			fetchGame(userId);
		}
	}, []);

	//update game data
	useEffect(() => {
		if (twoPlayersInGame) {
			console.log("Game: refershing game data");
			fetchGame(userId!);
		}
	}, [twoPlayersInGame]);
	
	// fetch game data from server
	async function fetchGame(userID: string) {
		const url = `${constants.API_GAME}getGame/${userID}`; //todo make constants
		console.log(`Game: fetching game data for user: ${userID} from: "${url}"`);
		
		try {
			const response = await fetch(url);
			if (!response?.ok) {
				throw new Error(`Error getting gameData`);
			}
			const data : UpdateGameDto = await response.json();
			console.log('Game data: ', data);
			if (!data) {
				throw new Error(`No game data found`);
			} else {
				setGameData(data);
				console.log(`Game: game data and room set`);
			}
		}	catch (error) {
			console.error(error);
		}
	}
	
	
	// set up websocket connection and join room
	useEffect(() => {
		if (gameData && roomId === 0) {
			setRoomId(gameData.id);
			if (gameSocket) {
				gameSocket.emit("game/joinRoom", roomId);
				console.log("Game: joined room");
			} else {
				console.error("Game: no room id or socket connection");	
			}
			
			gameSocket.on(`game/message`, (msg: string) => {
				console.log(`Game: got message ${msg}`);
			});
			
			
			gameSocket.on(`game/updateGameState`, (payload: updateGameStateDto) => {
				console.log(`Game: received game state update from server`, payload.roomId, payload.state);
				setGameState(payload.state);
			});

			// gameSocket.on(`game/sendToRoom`, (payload: sendToRoomDto) => {
			// 	console.log(`Game: got message in my room: ${payload.msg}`);
			// });
			
		} else if (!gameData){
			console.error("Game: no game data to create socket conn");
		}
		
		return () => {
			gameSocket?.off(`game/${roomId }`); //todo check where the disconnct should be
		}
		
	}, [gameData]);
	

	//set type of game instance. 0 for player 1, 1 for player 2, 2 for observer
	useEffect(() => {
		if (gameData) {
			if (gameData.GameUsers && gameData.GameUsers[0]) {
			if (gameData.GameUsers[0].user.id === parseInt(userId!)) {
				setInstanceType(instanceTypes.left);
				console.log(`Game: setting instance type to ${instanceTypes.left}`);
			} else {
				setInstanceType(instanceTypes.right);
				console.log(`Game: setting instance type to ${instanceTypes.right}`);
			}	}
		}
	}, [gameData]);
	
	// //in case observer create game instance
	// useEffect(() => {
	// 	if (gameData && instanceType === 2) {
	// 		console.log("Game: creating game instance of type: ", instanceType);
	// 		const newGame = new Game(canvasRef.current!, instanceType, gameData!);
	// 		setGame(newGame);
	// 		console.log("Game: created observer instance");
	// 	}
	// } , [instanceType]);


	// create game instance when canvas is available and there are two players
	useEffect(() => {
		if (!game && canvasRef.current && gameData && instanceType !== 2) {
			console.log("Game: creating game instance of type: ", instanceType);
			
			//todo:"refresh game data"
			const newGame = new Game(canvasRef.current, instanceType, gameData!);
			setGame(newGame);
			console.log("Game: created");
			if (instanceType === 1) {
				setGameReady(1);
			} else if (instanceType === 0) {
				console.log("Game: Waiting for second player to join");
			}
		} else if (!canvasRef.current){
			console.error("Game: no canvas ref");
		} else if (!gameData) {
			console.error("Game: no game data");
		}
	}, [canvasRef.current, instanceType, twoPlayersInGame]);
	


	// send ready to start message to server when game is ready
	useEffect(() => {
		if (gameReady === 1 && game !== null) {
			console.log("Game: sending 'game ready to start' message to server");
			const payload: updateGameStateDto = {roomId: roomId, state: GameState.READY_TO_START};
			gameSocket.emit("game/updateGameState", payload);
		}
	}, [gameReady]);
	
	
	//start game when game state is ready to start
	useEffect(() => {
		if (gameState === GameState.READY_TO_START && game !== null) {
			console.log("Game: starting game");
			game.startGame();
		} else {
			console.error("Game : unable to start game");
		}
	}, [gameState]);
	
	// return the canvas
	return (
		<>
			<canvas ref={canvasRef} />
		</>
	);
}
