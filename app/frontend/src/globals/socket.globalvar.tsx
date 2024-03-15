import io from 'socket.io-client'
import { constants } from '@global/constants.globalvar'
// import 


/**
 * This sweet baby is our page-wide websocket-server
 */
export const transcendenceSocket = io(constants.BACKEND_ADRESS_FOR_WEBSOCKET, 
	{ 
		autoConnect: true
	});

// import { transcendenceSocket } from "./socket.globalvar";



// export const transcendenceConnect = (user: string) => {
// 	// console.log("I should do something with my connection status");
// 	console.log(`connecting to transcendence websocket for user [${user}]`);
// 	transcendenceSocket.connect();
// 	// if (user && user != '' && user != '0') {
// 		// console.log(`Setting connection status for ${user} with id ${transcendenceSocket.id}`);
		
// 		// const updatedProps: UpdateUserDto = {
// 		// 	online: OnlineStatus.ONLINE,
// 		// 	token: transcendenceSocket.id
// 		// }
// 		// const updateUser = async (updatedProps: UpdateUserDto) => {
// 		// 	try {
// 		// 		const response = await fetch(constants.BACKEND_ADRESS_FOR_WEBSOCKET + `users/${user}`, {
// 		// 			method: 'PATCH',
// 		// 			headers: {
// 		// 				'Content-Type': 'application/json',
// 		// 			},
// 		// 			body: JSON.stringify(updatedProps),
// 		// 		});
// 		// 		if (!response.ok) {
// 		// 			throw new Error('Failed to patch data');
// 		// 		}
// 		// 		// 	const result = await response.json();
// 		// 		// 	setData(result);
// 		// 	} catch (error) {
// 		// 		// setError(error);
// 		// 		console.error('Error while waiting for socket event:', error);
// 		// 	}
// 		// };
// 		// updateUser(updatedProps);
// 	// }
	
	
	// sessionStorage.setItem('loginName', user.loginName); 
	// sessionStorage.setItem('userId', user.id.toString());
	// setCurrentUser(user.id); 
	// console.log(`User set to ${user.id}`)


