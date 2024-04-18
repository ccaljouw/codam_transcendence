// import { WebSocket } from 'ws';
// import { Game } from '../components/Game';
// import { GameState } from '@prisma/client';
// import { UpdateGameObjectsDto, UpdateGameStateDto } from '@ft_dto/game';
// import { setNewPaddlePositions } from './gameSocketListners';


// export function setObserverSocket(game: Game) {
//   const serverUrl = 'ws://localhost:3000'; //todo get from global
//   const ws = new WebSocket(serverUrl);
//   const id = game.gameData!.id;

//   ws.on('open', () => {
//     console.log('Observer: connected to game backend socket');
//     ws.send(JSON.stringify({
//       event: 'game/joinRoom',
//       roomId: id 
//     }));
//   });

//   ws.on('message', (data: WebSocket.Data) => {
//     try {
//       const message = JSON.parse(data.toString());
//       if (message && message.event) {
//         switch (message.event) {
//           case 'game/updateGameObjects':
//             if (message.data) {
//               handleUpdateGameObjects(game, message.data);
//             }
//             break;
         
//             //add more options here
//           default:
//             console.log(`Observer: Received unhandled event type '${message.event}'`);
//         }
//       }
//     } catch (error) {
//       console.error('Observer: Error parsing message:', error);
//     }
//   });

//   ws.on('close', () => {
//     console.log('Observer: connection closed');
//   });

//   ws.on('error', (error: Error) => {
//     console.error('Observer: error:', error);
//   });
// }
  

// function handleUpdateGameObjects(game: Game, payload: UpdateGameObjectsDto) {
//   console.log(`Observer (${game.gameData!.id}) received game objects update`, payload);
//   if (game.gameState === GameState.FINISHED) {
//     console.log('Observer: Game is finished, no updates will be processed.');
//     return;
//   }

//   if (payload.roomId !== undefined) {
//     console.log('Observer: Setting new game objects');
//     game.receivedUpdatedGameObjects = {
//       ...game.receivedUpdatedGameObjects,
//       ...payload
//     };
//   } else {
//     console.error(`Observer: received game objects update from server, but no roomId in payload`, payload);
//   }

//   if (payload.paddle1Y! > 0 || payload.paddle2Y! > 0) {
//     console.log('Observer: Setting new paddle positions');
//     setNewPaddlePositions(game, payload.paddle1Y!, payload.paddle2Y!);
//   }
// }
