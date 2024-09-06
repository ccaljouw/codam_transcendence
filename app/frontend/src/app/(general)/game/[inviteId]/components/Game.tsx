"use client"
import { useRef, useEffect, useState, useContext } from 'react'
import { GameState } from '@prisma/client'
import { GetGameDto, UpdateGameDto, UpdateGameStateDto } from '@ft_dto/game'
import { Game } from '@ft_game/components/Game.ts'
import { InstanceTypes } from '@ft_game/utils/constants.ts'
import { transcendenceSocket } from '@ft_global/socket.globalvar'
import { constants } from '@ft_global/constants.globalvar.tsx'
import useFetch from 'src/globals/functionComponents/useFetch.tsx'
import styles from '../styles.module.css';
import { useRouter } from 'next/navigation';
import { TranscendenceContext } from 'src/globals/contextprovider.globalvar'
import { H3 } from 'src/globals/layoutComponents/Font'


// GameComponent is a functional component that renders the game canvas and handles game logic
export default function GameComponent({inviteId}: {inviteId: number}) {
  const gameSocket = transcendenceSocket;
	const canvasRef = useRef< HTMLCanvasElement | null >(null);
	const router = useRouter();
	const {data: fetchedGameData, isLoading: loadingGame, error: errorGame, fetcher: gameFetcher} = useFetch<GetGameDto | null, UpdateGameDto>();
  const {currentUser} = useContext(TranscendenceContext);
	const userId  = (currentUser.id).toString();
	const [game, setGame] = useState< Game | null >(null);
	const [roomId, setRoomId] = useState<number>(0);
	const [waitingForPlayers, setWaitingForPlayers] = useState<boolean>(true);
	const [instanceType, setInstanceType] = useState<InstanceTypes>(InstanceTypes.notSet) // 0 for player 1, 1 for player 2
  const [aiLevel, setAiLevel] = useState<number>(0);

  function startGame() {
    console.log("GameComponent: starting game");
    canvasRef.current!.focus();
    const payload: UpdateGameStateDto = {id: roomId, state: GameState.STARTED};
    gameSocket.emit("game/updateGameState", payload);
  }
  
  function abortGame() {
    console.log("GameComponent: aborting game");
    if (game?.gameState !== GameState.ABORTED && game?.gameState !== GameState.FINISHED) {
      const payload: UpdateGameStateDto = {id: roomId, state: GameState.ABORTED};
      gameSocket.emit("game/updateGameState", payload);
    }
  }
  
  function handleClick() {
    console.log("GameComponent: leaving game");
    game?.cleanCanvas();
    abortGame();
    router.push('/play');
  }
  
  // fetch game data
  useEffect(() => {
    if (inviteId === -1 ) {
      setAiLevel(0.5);
    }
    console.log("GameComponent: InviteId: ", inviteId);
    if (userId && gameSocket.id && game === null) {
      console.log("GameComponent: transendance socket id: ", gameSocket.id);
      if(inviteId == 0) console.log("GameComponent: fetching random game");
      else console.log("GameComponent: fetching invite game");
      
      const payloadGetGame : GetGameDto = {userId: parseInt(userId), clientId: gameSocket.id, inviteId: inviteId};
      gameFetcher({url: `${constants.API_GETGAME}`, fetchMethod: 'PATCH', payload: payloadGetGame});
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
    if(fetchedGameData.state === GameState.READY_TO_START || inviteId === -1) {
      setWaitingForPlayers(false);
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
        gameFetcher({url: `${constants.API_GAME}${fetchedGameData.id}`});
      }
    }; 
    
    const handleGameStateUpdate = (payload: UpdateGameStateDto) => {
      if (!game) {
        return;
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
				const firstUserId = fetchedGameData?.GameUsers?.[0]?.user.id || 0;
				setInstanceType(userIdNum === firstUserId ? InstanceTypes.left : InstanceTypes.right);
		}
	}, [waitingForPlayers]);
	
	
  // create game instance when canvas is available and there are two players
	useEffect(() => {
		if (!game && canvasRef.current && instanceType !== InstanceTypes.notSet) {
			console.log("GameComponent: creating game instance of type: ", instanceType);

      // set required configuration in constants
			const newGame = new Game(
        canvasRef.current,
        instanceType,
        fetchedGameData!,
        constants.config, // config
        constants.themes[fetchedGameData?.GameUsers?.[instanceType].user.theme], // theme
        fetchedGameData?.GameUsers?.[instanceType].user.volume, // volume > todo: set in player profile. negative numbers are igored in soundFX
        aiLevel // AI level > todo: implement AI level button and backend. 0 = not an ai game 0.1 > 1 is level
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
        <div className={`${styles.game}`}>
          <div className={`text-center`}>
            <img src={`${constants.API_AVATAR}waitingForOtherPlayers.jpg`}/>
            <p>Are you stronger than your opponent? <br></br>How many squats can you do while waiting?</p>
          </div>
        </div>
			) : ( <>
          <div className={`${styles.game}`}>
            <div className={`row`}>
              <button className="btn btn-dark text-center" onClick={handleClick}>Leave Game</button>
            </div>
            <canvas ref={canvasRef} tabIndex={0} />
				  </div>
        </>)}
		</>
	);
}
