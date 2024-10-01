"use client"
import { useRef, useEffect, useState, useContext } from 'react'
import { GameState } from '@prisma/client'
import { GetGameDto, UpdateGameDto, UpdateGameStateDto } from '@ft_dto/game'
import { Game } from '@ft_game/components/Game.ts'
import { InstanceTypes } from '@ft_game/utils/constants.ts'
import { transcendenceSocket } from '@ft_global/socket.globalvar'
import { constants } from '@ft_global/constants.globalvar.tsx'
import useFetch from 'src/globals/functionComponents/useFetch.tsx'
import styles from '../styles.module.css'
import { useRouter } from 'next/navigation'
import { TranscendenceContext } from 'src/globals/contextprovider.globalvar'

// GameComponent is a functional component that renders the game canvas and handles game logic
export default function GameComponent({ inviteId }: { inviteId: number }) {
	const gameSocket = transcendenceSocket;
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const router = useRouter();
	const { data: fetchedGameData, isLoading: loadingGame, error: errorGame, fetcher: gameFetcher } = useFetch<GetGameDto | null, UpdateGameDto>();
	const { currentUser } = useContext(TranscendenceContext);
	const userId = (currentUser.id).toString();
	const [game, setGame] = useState<Game | null>(null);
	const [roomId, setRoomId] = useState<number>(0);
	const [waitingForPlayers, setWaitingForPlayers] = useState<boolean>(true);
	const [instanceType, setInstanceType] = useState<InstanceTypes>(InstanceTypes.notSet) // 0 for player 1, 1 for player 2
	const [aiLevel, setAiLevel] = useState<number>(0);
	const context = useContext(TranscendenceContext);


	function startGame() {
		console.log("GameComponent: starting game");
		canvasRef.current!.focus();
		const payload: UpdateGameStateDto = { id: roomId, state: GameState.STARTED };
		gameSocket.emit("game/updateGameState", payload);
	}

	function abortGame() {
		if (game)
			if (canvasRef.current) {
				game.cleanCanvas();
			}
		if (
			game?.gameState === GameState.WAITING ||
			game?.gameState === GameState.READY_TO_START ||
			game?.gameState === GameState.STARTED) {
			console.log("GameComponent: aborting game");
			const payload: UpdateGameStateDto = { id: roomId, state: GameState.ABORTED };
			gameSocket.emit("game/updateGameState", payload);
		}
	}

	function handleClick() {
		if (waitingForPlayers) {
			console.log(`GameComponent: leaving waiting room`);
			const payload: UpdateGameStateDto = { id: roomId, state: GameState.ABORTED };
			gameSocket.emit("game/updateGameState", payload);
		}
		router.push('/play');
	}

	// cleanup on beforeunload and visibilitychange
	useEffect(() => {

		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			console.log("GameComponent: before unload event, cleaning up resources");
			abortGame();
		};

		const handleVisibilityChange = () => {
			console.log("GameComponent: visibility change event, cleaning up resources");
			if (document.hidden) {
				abortGame();
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		document.addEventListener('visibilitychange', handleVisibilityChange);

		//on unmount
		return () => {
			console.log("GameComponent: cleaning up resources");
			abortGame();
			window.removeEventListener('beforeunload', handleBeforeUnload);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}
		, [game]);

	// fetch game data
	useEffect(() => {
		if (inviteId === -1) {
			setAiLevel(0.5);
		}
		console.log("GameComponent: InviteId: ", inviteId);
		if (userId && gameSocket.id && game === null) {
			console.log("GameComponent: transendance socket id: ", gameSocket.id);
			if (inviteId == 0) console.log("GameComponent: fetching random game");
			else console.log("GameComponent: fetching invite game");

			const payloadGetGame: GetGameDto = { userId: parseInt(userId), clientId: gameSocket.id, inviteId: inviteId };
			gameFetcher({ url: `${constants.API_GETGAME}`, fetchMethod: 'PATCH', payload: payloadGetGame });
		}
	}, [inviteId]);


	// update game data
	useEffect(() => {
		if (!fetchedGameData) return;
		if (fetchedGameData.state === GameState.READY_TO_START && roomId !== 0 && canvasRef.current) {
			startGame();
			return;
		}
		if (roomId === 0) {
			setRoomId(fetchedGameData.id);
		} else {
			console.log("GameComponent: waiting for second player to join in get/update game data");
		}
		if (fetchedGameData.state === GameState.READY_TO_START || inviteId === -1) {
			setWaitingForPlayers(false);
		}
		if (fetchedGameData.state === GameState.REJECTED || fetchedGameData.state === GameState.ABORTED || fetchedGameData.state === GameState.FINISHED) {
			console.log("GameComponent: fetched game was rejected or aborted");
			router.push(`/play`);
		}
	}, [fetchedGameData]);


	// join room
	useEffect(() => {
		if (roomId !== 0) {
			console.log("GameComponent: joining room:", roomId);
			gameSocket.emit("game/joinRoom", roomId);
		};
	}, [roomId]);


	// handle socket events
	useEffect(() => {

		const handleMessage = (msg: string) => {
			console.log(`GameComponent: received message: "${msg}"`);
			if (fetchedGameData?.state === GameState.WAITING && fetchedGameData?.id) {
				console.log("GameComponent: less than two players in game, refreshing game data, gameid:", fetchedGameData.id);
				gameFetcher({ url: `${constants.API_GAME}${fetchedGameData.id}` });
			}
		};

		const handleGameStateUpdate = (payload: UpdateGameStateDto) => {
			if (!game) {
				if (payload.state === GameState.REJECTED) {
					console.log("GameComponent: game rejected or aborted");
					router.push(`/play`);
				} else {
					return;
				}
			}
			console.log(`GameComponent: received game state update in handle gameState`, payload.id, payload.state);
			if (payload.state === GameState.FINISHED || payload.state === GameState.ABORTED) {
				console.log("GameComponent: game finished");
				return;
			}
			if (payload.state === GameState.REJECTED) {
				console.log("GameComponent: game rejected");
				router.push(`/play`);
			} else return;
		};

		gameSocket.on(`game/message`, handleMessage);
		gameSocket.on(`game/updateGameState`, handleGameStateUpdate);

		return () => {
			console.log("GameComponent: disconnecting socket");
			gameSocket.off(`game/message`, handleMessage);
			gameSocket.off(`game/updateGameState`, handleGameStateUpdate);
			gameSocket.emit("game/leaveRoom", roomId);
		};
	}, [roomId]);


	// set instance type
	useEffect(() => {
		if (waitingForPlayers === false && fetchedGameData && userId) {
			const userIdNum = parseInt(userId || '0');
			const firstUserId = fetchedGameData?.GameUsers?.[0]?.user?.id || 0;
			setInstanceType(userIdNum === firstUserId ? InstanceTypes.left : InstanceTypes.right);
		}
	}, [waitingForPlayers]);


	// create game instance when canvas is available and there are two players
	useEffect(() => {
		if (!game && canvasRef.current && instanceType !== InstanceTypes.notSet) {
			console.log("GameComponent: creating game instance of type: ", instanceType);
			// set required configuration in constants
			let newVolume = 0.5;
			let newTheme = 0;
			if (fetchedGameData?.GameUsers?.[instanceType].user?.volume !== undefined)
				newVolume = fetchedGameData?.GameUsers?.[instanceType].user.volume;
			if (fetchedGameData?.GameUsers?.[instanceType].user?.theme !== undefined)
				newTheme = fetchedGameData?.GameUsers?.[instanceType].user.theme;

			const newGame = new Game(
				canvasRef.current,
				instanceType,
				fetchedGameData!,
				constants.config, // config
				constants.themes[newTheme], // theme
				context,
				newVolume, //volume
				aiLevel // AI level
			);
			setGame(newGame);
			if (inviteId === -1) {
				startGame();
			}
			canvasRef.current.focus();
		}
	}, [instanceType]);


	return (
		<>
			{waitingForPlayers ? (
				<div>
					<div className={`${styles.game}`}>
						<button className="btn btn-dark text-center" onClick={handleClick}>{waitingForPlayers ? "Leave waiting room" : "Leave Game"}</button>
						<img src={`${constants.API_AVATAR}waitingForOtherPlayers.jpg`} />
					</div>
				</div>
			) : (
				<div className={`${styles.game}`}>
					<div className={`row`}>
						<button className="btn btn-dark text-center" onClick={handleClick}>Leave Game</button>
					</div>
					<canvas ref={canvasRef} tabIndex={0} />
				</div>
			)}
		</>
	);
}
