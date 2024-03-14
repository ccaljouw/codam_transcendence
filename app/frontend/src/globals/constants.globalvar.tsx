

/**
 * File for constants.
 * Import like so:
 * import {constants} from '(**)/constants.globalvar'
 * 
 * Use like so
 * const my_var_needing_constant = constants.MY_CONSTANT
 */

export class constants{
  static API_LOGIN42 = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-66c50cf4e54a51062bc5f0c110035ff12e1b0427cc1066c11d6e5c220a2ed1dc&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauthentication&response_type=code';
	static API_REGISTER = 'http://localhost:3001/users/register';
	static API_ALL_USERS = 'http://localhost:3001/users/all';
	static API_SINGLE_USER = 'http://localhost:3001/users/';
	static API_ALL_USERS_BUT_ME = 'http://localhost:3001/users/allButMe/';
	static API_SWAGGER = 'http://localhost:3001/api';
	
	static CHAT_CHECK_IF_DM_EXISTS = 'http://localhost:3001/chat/checkIfDMExists/';
	static CHAT_GET_UNREADS = 'http://localhost:3001/chat/getUnreads/';
	static CHAT_GET_MESSAGES_FROM_CHAT = 'http://localhost:3001/chat/messages/';
	static CHAT_CREATE_DM = 'http://localhost:3001/chat/createDM';
	static BACKEND_ADRESS_FOR_WEBSOCKET = 'http://localhost:3001/';
}
