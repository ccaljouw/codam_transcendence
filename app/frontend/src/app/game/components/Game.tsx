"use client"
import { useRef, useEffect, useState, use } from 'react'
import { GameState } from '@prisma/client'
import { UpdateGameDto, updateGameStateDto } from '@ft_dto/game'
import { Game } from '../../../../../game/components/Game.tsx'
import { InstanceTypes } from '../../../../../game/utils/constants.tsx'
import { transcendenceSocket } from '@ft_global/socket.globalvar'
import { constants } from '@ft_global/constants.globalvar.tsx'
import DataFetcherJson from 'src/globals/functionComponents/DataFetcherJson.tsx'

export default function GameComponent() {
	const gameSocket = transcendenceSocket;
	const canvasRef = useRef< HTMLCanvasElement | null >(null);
	const userId  = sessionStorage.getItem('userId'); // todo: change to token
	const [game, setGame] = useState< Game | null >(null);
	const [gameData , setGameData] = useState<UpdateGameDto | null> (null);
	const [roomId, setRoomId] = useState<number>(0);
	const [playersInGame, setPlayersInGame] = useState<number>(0);
	const [gameState, setGameState] = useState<GameState>(GameState.WAITING);
	const [waitingForPlayers, setWaitingForPlayers] = useState<boolean>(true);
	const [instanceType, setInstanceType] = useState<InstanceTypes>(InstanceTypes.observer) // 0 for player 1, 1 for player 2, 2 for observer
	
	// fetch game data
	useEffect(() => {
		if (userId) {
			fetchGame(userId);
		}
	}, []);


	// fetch game data from server
	async function fetchGame(userID: string) {
		const url = `${constants.API_GAME}getGame/${userID}`;
		console.log(`Game: fetching game data for user: ${userID} from: "${url}"`);
		
		try {
			const data: UpdateGameDto = await DataFetcherJson({ url: url });
			console.log('Game data: ', data);
			if (!data) {
				throw new Error(`No game data found`);
			} else {
				setGameData(data);
				// console.log(`Game: game data and room set`);
			}
		}	catch (error) {
			console.error(error);
		}
	}

	async function refreshData(id: number) {
		const url = `${constants.API_GAME}${id}`;
		console.log(`Game: fetching game data for gameId: ${id} from: "${url}"`);
		try {
			const data: UpdateGameDto = await DataFetcherJson({ url: url });
			console.log('Game data found in refresh: ', data);
			if (!data) {
				throw new Error(`refresh data: No game data found`);
			} else {
				setGameData(data);
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
				if (gameState === GameState.WAITING) {
					console.log(`Game: got message ${msg}`);
					//it there are less than two players in game, refresh game data
					if (gameData.GameUsers!.length < 2) {
						console.log("Game: less than two players in game, refreshing game data");
						refreshData(gameData.id);
						console.log("Game: refreshed game data");
					} else {
						console.log("Game: two players in game");
						setPlayersInGame(2);
					}
				}
			});
			
			gameSocket.on(`game/updateGameState`, (payload: updateGameStateDto) => {
				console.log(`Game: received game state update`, payload.roomId, payload.state);
				setGameState(payload.state);

				//todo send message to server with game state updates
			});
			
			} else if (!gameData){
				console.error("Game: no game data to create socket conn");
			}
			
			return () => {
				gameSocket?.off(`game/${roomId }`); //todo check where the disconnct should be
			}
		}, [gameData]);


	useEffect(() => {
		if (gameData && gameData.GameUsers && gameData.GameUsers.length === 2) {
			console.log("Gamedata!!!: ", gameData);
			setPlayersInGame(2);
		} else {
			console.log("WAITING FOR SECOND PLAYER!!!");
		}
	}, [gameData]);


	useEffect(() => {
		if (playersInGame === 2) {
			setWaitingForPlayers(false);
		}
	}, [playersInGame]);

	
	//set type of game instance. 0 for observer, 1 for player 1, 2 for player 2
	useEffect(() => {
		if (playersInGame === 2) {
			if (gameData!.GameUsers && gameData!.GameUsers[0]) {
				if (gameData!.GameUsers[0].user.id === parseInt(userId!)) {
					setInstanceType(InstanceTypes.left);
					console.log(`Game: setting instance type to ${InstanceTypes.left}`);
				} else {
					setInstanceType(InstanceTypes.right);
					console.log(`Game: setting instance type to ${InstanceTypes.right}`);
				}
			}
		}
	}, [playersInGame]);


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
		if (!game && canvasRef.current && instanceType !== 2) {
			console.log("Game: creating game instance of type: ", instanceType);
		
			const newGame = new Game(canvasRef.current, instanceType, gameData!);
			setGame(newGame);
			console.log("Game: created");
			canvasRef.current.focus();
			// if (instanceType === 2) {
			// } else if (instanceType == 1) {
			// 	console.log("Game: Waiting for second player to join");
			// }
		} else if (!canvasRef.current){
			console.error("Game: no canvas ref");
		} else if (!gameData) {
			console.error("Game: no game data");
		}
	}, [canvasRef.current, instanceType, gameData]);
	


	// send ready to start message to server when game is ready
	useEffect(() => {
		if (game !== null) {
			console.log("Game: sending 'game ready to start' message to server");
			const payload: updateGameStateDto = {roomId: roomId, state: GameState.READY_TO_START};
			gameSocket.emit("game/updateGameState", payload);
		}
	}, [game]);
	
	
	//start game when game state is ready to start
	useEffect(() => {
		if (gameState === GameState.READY_TO_START && game !== null && canvasRef.current) {
			console.log("Game: starting game");
			setGameState(GameState.STARTED);
			canvasRef.current.focus();
			game.startGame();
		} else if (gameState === GameState.FINISHED) {
			console.log("Game: game finished add more code here");
			// todo add code
		}
	}, [gameState, canvasRef.current, game]);
	
	// return the canvas
	return (
		<>
			{waitingForPlayers ? (
				<p>Waiting for second player to join...</p>
			) : (
				<canvas ref={canvasRef} tabIndex={0} />
		)}
		</>
	);
}	
