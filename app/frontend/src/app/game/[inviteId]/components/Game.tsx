"use client"
import { useRef, useEffect, useState } from 'react'
import { GameState } from '@prisma/client'
import { GetGameDto, UpdateGameDto, UpdateGameStateDto } from '@ft_dto/game'
import { Game } from '@ft_game/components/Game.ts'
import { InstanceTypes } from '@ft_game/utils/constants.ts'
import { transcendenceSocket } from '@ft_global/socket.globalvar'
import { constants } from '@ft_global/constants.globalvar.tsx'
import useFetch from 'src/globals/functionComponents/useFetch.tsx'
import styles from '../styles.module.css';
import { useRouter } from 'next/navigation';


// GameComponent is a functional component that renders the game canvas and handles game logic
export default function GameComponent({inviteId}: {inviteId: number}) {
	const gameSocket = transcendenceSocket;
	const canvasRef = useRef< HTMLCanvasElement | null >(null);
	const userId  = sessionStorage.getItem('userId');
	const [game, setGame] = useState< Game | null >(null);
	const [roomId, setRoomId] = useState<number>(0);
	const [waitingForPlayers, setWaitingForPlayers] = useState<boolean>(true);
	const [instanceType, setInstanceType] = useState<InstanceTypes>(InstanceTypes.notSet) // 0 for player 1, 1 for player 2
	const {data: fetchedGameData, isLoading: loadingGame, error: errorGame, fetcher: gameFetcher} = useFetch<GetGameDto | null, UpdateGameDto>();
	const router = useRouter();


  function disconnectSocket() {
    console.log("Game: disconnecting socket");
    gameSocket.off(`game/message`, handleMessage);
    gameSocket.off(`game/updateGameState`, handleGameStateUpdate);
    gameSocket.emit("game/leaveRoom", roomId);
  }

  function handleClick() {
    if (game?.gameState !== GameState.ABORTED && game?.gameState !== GameState.FINISHED) {
      const payload: UpdateGameStateDto = {id: roomId, state: GameState.ABORTED};
      gameSocket.emit("game/updateGameState", payload);
    }
    console.log("Game: leaving game");
    disconnectSocket();
    router.push('/play');
  }

  const handleMessage = (msg: string) => {
    console.log(`Game: got game/message ${msg}`);
    if (fetchedGameData?.state === GameState.WAITING && fetchedGameData.id) {
      console.log("Game: less than two players in game, refreshing game data, gameid:", fetchedGameData.id);
      gameFetcher({url: `${constants.API_GAME}${fetchedGameData.id}`});
      console.log("Game: refreshed game data");
    }
  }; 
  
  const handleGameStateUpdate = (payload: UpdateGameStateDto) => {
    console.log(`Game: received game state update in handle gameState`, payload.id, payload.state);
    console.log('Game: current game:', game);
    if (payload.state === GameState.REJECTED) {
      router.push(`/play`);
    } else return;
  };
  
  // handle incomming game messages
  gameSocket.on(`game/message`, handleMessage);
  gameSocket.on(`game/updateGameState`, handleGameStateUpdate);

	// fetch game data
	useEffect(() => {
    console.log("InviteId: ", inviteId);
    console.log("InviteId type: ", typeof inviteId);
    if (userId && gameSocket.id && game === null) {
      console.log("transendance socket id: ", gameSocket.id);
      
      if(inviteId == 0) console.log("Game: fetching random game");
      else console.log("Game: fetching invite game");
      
      const payloadGetGame : GetGameDto = {userId: parseInt(userId), clientId: gameSocket.id, inviteId: inviteId};
      gameFetcher({url: `${constants.API_GETGAME}`, fetchMethod: 'PATCH', payload: payloadGetGame});
		}
	}, [userId, inviteId]);
  
  // join room
  useEffect(() => {
    if (roomId !== 0) {
      console.log("Game: joining room:", roomId);
      gameSocket.emit("game/joinRoom", roomId);
    };
  }, [roomId]);
  
  // update game data
  useEffect(() => {
    if (!fetchedGameData) return;
    if (fetchedGameData.state === GameState.READY_TO_START && roomId !== 0 && canvasRef.current) {
      console.log("Game: starting game");
      canvasRef.current.focus();
      const payload: UpdateGameStateDto = {id: roomId, state: GameState.STARTED};
      gameSocket.emit("game/updateGameState", payload);
    }
    if (roomId === 0) {
      setRoomId(fetchedGameData.id);
    } else {
      console.log("Game: waiting for second player to join  in get/update game data");
    }
    if(fetchedGameData.state === GameState.READY_TO_START)
      setWaitingForPlayers(false);
  }, [fetchedGameData]);

	// set instance type
	useEffect(() => {
		if (waitingForPlayers === false && fetchedGameData && userId) {
				const userIdNum = parseInt(userId || '0');
				const firstUserId = fetchedGameData?.GameUsers?.[0]?.user.id || 0;
				setInstanceType(userIdNum === firstUserId ? InstanceTypes.left : InstanceTypes.right);
		}
	}, [waitingForPlayers]);
	
	// create game instance when canvas is available and there are two players
	useEffect(() => {
		if (!game && canvasRef.current && instanceType !== InstanceTypes.notSet) {
			console.log("Game: creating game instance of type: ", instanceType);

			//set required configuration in constants
			const newGame = new Game(canvasRef.current, instanceType, fetchedGameData!, constants.configuration, constants.themes[fetchedGameData?.GameUsers?.[instanceType].user.theme]);
			setGame(newGame);
			canvasRef.current.focus();
		}
}, [instanceType]);
  

	return (
		<>
			{waitingForPlayers ? (
				<div>
					<p>Waiting for second player to join...</p>
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
