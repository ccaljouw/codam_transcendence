"use client"
import { useRef, useEffect, useState, use } from 'react'
import { GameState } from '@prisma/client'
import { UpdateGameDto, UpdateGameStateDto } from '@ft_dto/game'
import { Game } from '../../../../../game/components/Game.ts'
import { InstanceTypes } from '../../../../../game/utils/constants.ts'
import { transcendenceSocket } from '@ft_global/socket.globalvar'
import { constants } from '@ft_global/constants.globalvar.tsx'
import useFetch from 'src/globals/functionComponents/useFetch.tsx'

export default function GameComponent() {
	const gameSocket = transcendenceSocket;
	const canvasRef = useRef< HTMLCanvasElement | null >(null);
	const userId  = sessionStorage.getItem('userId'); // todo: change to token
	const [game, setGame] = useState< Game | null >(null);
	const [gameData , setGameData] = useState<UpdateGameDto | null> (null);
	const [roomId, setRoomId] = useState<number>(0);
	const [gameState, setGameState] = useState<GameState>(GameState.WAITING);
	const [waitingForPlayers, setWaitingForPlayers] = useState<boolean>(true);
	const [instanceType, setInstanceType] = useState<InstanceTypes>(InstanceTypes.observer) // 0 for player 1, 1 for player 2, 2 for observer
	const {data: fetchedGameData, isLoading: loadingGame, error: errorGame, fetcher: gameFetcher} = useFetch<null, UpdateGameDto>();


	// fetch game data
	//todo add trancendancesocket.id (token) to get id
	useEffect(() => {
		if (userId) {
			fetchGame(`${constants.API_GAME}getGame/${userId}`);
		}
	}, [userId]);


	// join room when game data is available
	useEffect(() => {
		if (gameData && roomId === 0) {
			setRoomId(gameData.id);
			gameSocket.emit("game/joinRoom", roomId);
			console.log("Game: joined room");
			
			const handleMessage = (msg: string) => {
				console.log(`Game: got message ${msg}`);
				if (gameState === GameState.WAITING && gameData.GameUsers!.length < 2) {
					console.log("Game: less than two players in game, refreshing game data");
					fetchGame(`${constants.API_GAME}${gameData.id}`);
					console.log("Game: refreshed game data");
				}
				//for message received whem player leaves game 
				if (gameState === GameState.STARTED && gameData.GameUsers!.length === 2) {
					fetchGame(`${constants.API_GAME}${gameData.id}`);
					if (gameData.GameUsers!.length < 2) {
						setGameState(GameState.FINISHED);
					}
				}
			}; 
		
			const handleGameStateUpdate = (payload: UpdateGameStateDto) => {
				console.log(`Game: received game state update`, payload.roomId, payload.state);
				if (gameState !== payload.state) {
						setGameState(payload.state);
				}
			};

			gameSocket.on(`game/message`, handleMessage);
			gameSocket.on(`game/updateGameState`, handleGameStateUpdate);
		} else if (!gameData){
		 	console.log("Game: waiting for game data to create socket conn");
		}
	}, [gameData, roomId, gameState, gameSocket]);

	
	// check if there are two players in the game	
	useEffect(() => {
		if (gameData && gameData.GameUsers && gameData.GameUsers.length === 2) {
			console.log("Game: two players in game!");
			setWaitingForPlayers(false);
		} else {
			console.log("Game: less than two players in game");
		}
	}, [gameData]);


	// set instance type
	useEffect(() => {
		if (waitingForPlayers === false) {
				const userIdNum = parseInt(userId || '0');
				const firstUserId = gameData?.GameUsers?.[0]?.user.id || 0;
				setInstanceType(userIdNum === firstUserId ? InstanceTypes.left : InstanceTypes.right);
		}
	}, [waitingForPlayers, gameData, userId]);
	


	// create game instance when canvas is available and there are two players
	useEffect(() => {
		if (waitingForPlayers === true) {
			return;
		}
		if (!game && canvasRef.current && instanceType !== InstanceTypes.observer) {
			console.log("Game: creating game instance of type: ", instanceType);
			const newGame = new Game(canvasRef.current, instanceType, gameData!);
			setGame(newGame);
			canvasRef.current.focus();
		} else if (!canvasRef.current){
			console.log("Game: waiting for canvas ref");
		} else if (!gameData) {
			console.log("Game: waiting for game data");
		}
	}, [canvasRef, instanceType, gameData, game]);


	// send ready to start message to server when game is ready
	useEffect(() => {
		if (game !== null) {
			const payload: UpdateGameStateDto = {roomId: roomId, state: GameState.READY_TO_START};
			gameSocket.emit("game/updateGameState", payload);
		}
	}, [game]);

	
	// start game when game state is ready to start
	useEffect(() => {
		if (gameState === GameState.FINISHED) {
			console.log("Game: game finished add more code cleanup code here!!");
			// todo add code
			return;
		}
		if (gameState === GameState.READY_TO_START && game && canvasRef.current) {
			console.log("Game: starting game");
			canvasRef.current.focus();
			const payload: UpdateGameStateDto = {roomId: roomId, state: GameState.STARTED};
			gameSocket.emit("game/updateGameState", payload);
		}
	}, [gameState, canvasRef.current, game]);
	

	// update game data
	useEffect(() => {
		if (fetchedGameData != null) {
			setGameData(fetchedGameData);
		}
	}, [fetchedGameData]);

	async function fetchGame(url: string) {
		await gameFetcher({url: url});
	}

	
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
