	"use client"
	import { useRef, useEffect, useState, useContext } from 'react'
	import { GameState } from '@prisma/client'
	import { UpdateGameDto, UpdateGameStateDto } from '@ft_dto/game'
	import { Game } from '@ft_game/components/Game.ts'
	import { InstanceTypes } from '@ft_game/utils/constants.ts'
	import { transcendenceSocket } from '@ft_global/socket.globalvar'
	import { constants } from '@ft_global/constants.globalvar.tsx'
	import useFetch from 'src/globals/functionComponents/useFetch.tsx'
	import styles from '../styles.module.css';
	import { useRouter } from 'next/navigation';
	import { TranscendenceContext } from 'src/globals/contextprovider.globalvar'

	export default function GameComponent() {
		const gameSocket = transcendenceSocket;
		const canvasRef = useRef< HTMLCanvasElement | null >(null);
		const userId  = sessionStorage.getItem('userId'); // todo: change to token
		const [game, setGame] = useState< Game | null >(null);
		const [gameData , setGameData] = useState<UpdateGameDto | null> (null);
		const [roomId, setRoomId] = useState<number>(0);
		const [gameState, setGameState] = useState<GameState>(GameState.WAITING);
		const [waitingForPlayers, setWaitingForPlayers] = useState<boolean>(true);
		const [instanceType, setInstanceType] = useState<InstanceTypes>(InstanceTypes.notSet) // 0 for player 1, 1 for player 2
		const {data: fetchedGameData, isLoading: loadingGame, error: errorGame, fetcher: gameFetcher} = useFetch<null, UpdateGameDto>();
		const router = useRouter();
		const context = useContext(TranscendenceContext);


		// fetch game data
		useEffect(() => {
			if (userId && game === null) {
				console.log("transendance socket id: ", gameSocket.id);
				fetchGame(`${constants.API_GAME}getGame/${userId}/${gameSocket.id}`);
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
		}, [gameData, roomId, gameState, gameSocket, context]);

		
		// check if there are two players in the game	
		useEffect(() => {
			if (gameData && gameData.GameUsers && gameData.GameUsers.length === 2 && gameState === GameState.WAITING) {
				setWaitingForPlayers(false);
			} else {
				console.log("Game: less than two players in game");
			}
		}, [gameData]);


		// set instance type
		useEffect(() => {
			if (waitingForPlayers === false && gameState === GameState.WAITING && gameData && userId) {
					const userIdNum = parseInt(userId || '0');
					const firstUserId = gameData?.GameUsers?.[0]?.user.id || 0;
					setInstanceType(userIdNum === firstUserId ? InstanceTypes.left : InstanceTypes.right);
			}
		}, [waitingForPlayers, gameData, userId]);
		


		// create game instance when canvas is available and there are two players
		useEffect(() => {
			if (waitingForPlayers === true || game?.gameState === GameState.FINISHED || game?.gameState === GameState.ABORTED) {
				return;
			}
			if (!game && canvasRef.current && instanceType !== InstanceTypes.notSet) {
				console.log("Game: creating game instance of type: ", instanceType);

				//set required configuration in constants
				const newGame = new Game(canvasRef.current, instanceType, gameData!, constants.configuration, constants.theme, context);
				setGame(newGame);
				canvasRef.current.focus();
			}
		}, [canvasRef, instanceType, gameData, game]);


		// send ready to start message to server when game is ready
		useEffect(() => {
			if (game !== null && gameState === GameState.WAITING) {
				const payload: UpdateGameStateDto = {roomId: roomId, state: GameState.READY_TO_START};
				gameSocket.emit("game/updateGameState", payload);
			}
		}, [game]);

		
		// start game when game state is ready to start
		useEffect(() => {
			if (gameState === GameState.ABORTED) {
				console.log("Game: game aborted add more code cleanup code here!!");
				// todo add code
				return;
			}
			if (gameState === GameState.FINISHED) {
				console.log("Game: game finished add more code cleanup code here!!");
				// Router.push('/home');
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

		// function leaveGame() {
		// 	const payload: UpdateGameStateDto = {roomId: roomId, state: GameState.ABORTED};
		// 	gameSocket.emit("game/updateGameState", payload);
		// 	console.log("Game: leaving game");
		// }

		function handleClick() {

			if (gameState !== GameState.FINISHED) {
				const payload: UpdateGameStateDto = {roomId: roomId, state: GameState.ABORTED};
				gameSocket.emit("game/updateGameState", payload);
			}
			console.log("Game: leaving game");
			router.push('/play');

		}

		
		// return the canvas
		return (
			<>
				{waitingForPlayers ? (
					<p>Waiting for second player to join...</p>
				) : (<>
				<div className={styles.game}>
					<div className={"text-center white-box " + styles.gameMenu}>
					<button className="btn btn-dark" onClick={handleClick}>Leave Game</button>
				</div>
					<canvas ref={canvasRef} tabIndex={0} />
					</div>
					</>
			)}
			</>
		);
	}	
