import io from 'socket.io-client'
import { constants } from '@ft_global/constants.globalvar'


/**
 * This sweet baby is our page-wide websocket-server
 */
export const transcendenceSocket = io(constants.BACKEND_BASEURL, 
	{ 
		autoConnect: true
	});

