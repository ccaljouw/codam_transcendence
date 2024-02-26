
import io from 'socket.io-client'
import { constants } from './constants.globalvar'


/**
 * This sweet baby is our page-wide websocket-server
 */
export const transcendenceSocket = io(constants.BACKEND_ADRESS_FOR_WEBSOCKET, 
	{ 
		autoConnect: false
	});

// import { transcendenceSocket } from "./socket.globalvar";



export const transcendenceConnect = (user: string) => {
	// console.log("I should do something with my connection status");
	console.log(`connecting to transcendence websocket for user [${user}]`);
	transcendenceSocket.connect();
	if (user && user != '' && user != '0') {
		console.log(`Setting connection status for ${user}`);
		transcendenceSocket.emit('socket/online', user);
	}
	// sessionStorage.setItem('loginName', user.loginName); 
	// sessionStorage.setItem('userId', user.id.toString());
	// setCurrentUser(user.id); 
	// console.log(`User set to ${user.id}`)
}

