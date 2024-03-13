

/**
 * File for constants.
 * Import like so:
 * import {constants} from '(**)/constants.globalvar'
 * 
 * Use like so
 * const my_var_needing_constant = constants.MY_CONSTANT
 */

export class constants{
	static API = 'http://localhost:3001/api';
	static API_ALL_USERS = 'http://localhost:3001/users/all';
	static API_SINGLE_USER = 'http://localhost:3001/users/';
	static API_ALL_USERS_BUT_ME = 'http://localhost:3001/users/allButMe/';

	static CHAT_CHECK_IF_DM_EXISTS = 'http://localhost:3001/chat/checkIfDMExists/';
	static CHAT_GET_UNREADS = 'http://localhost:3001/chat/getUnreads/';
	static CHAT_GET_MESSAGES_FROM_CHAT = 'http://localhost:3001/chat/messages/';
	static CHAT_CREATE_DM = 'http://localhost:3001/chat/createDM';
	static BACKEND_ADRESS_FOR_WEBSOCKET = 'http://localhost:3001/';
}
