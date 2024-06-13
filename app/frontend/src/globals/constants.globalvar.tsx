

/**
 * File for constants.
 * Import like so:
 * import {constants} from '(**)/constants.globalvar'
 * 
 * Use like so
 * const my_var_needing_constant = constants.MY_CONSTANT
*/

export class constants {

	static configuration = 'test';
	static themes = ['classic', 'blackAndWhite', 'neon'];

	static BACKEND_BASEURL = 'http://localhost:3001/';
	static FRONTEND_BASEURL = 'http://localhost:3000'; //todo: JMA: consider adding '/' at end of url
	
	// static API_LOGIN_42 = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-66c50cf4e54a51062bc5f0c110035ff12e1b0427cc1066c11d6e5c220a2ed1dc';
	
	static API_USERS = this.BACKEND_BASEURL + 'users/';
	static API_REGISTER = this.API_USERS + 'register/';
	static API_ALL_USERS = this.API_USERS + 'all/';
	static API_ALL_USERS_BUT_ME = this.API_USERS + 'allButMe/';
	static API_ADD_TOKEN = this.API_USERS + 'token/';
	static API_FRIENDS_FROM = this.API_USERS + 'friendsFrom/';
  
	static API_CHAT = this.BACKEND_BASEURL + 'chat/';
	static CHAT_CHECK_IF_DM_EXISTS = this.API_CHAT + 'checkIfDMExists/';
	static CHAT_GET_UNREADS = this.API_CHAT + 'getUnreads/';
	static CHAT_GET_MESSAGES_FROM_CHAT = this.API_CHAT + 'messages/';
	static CHAT_CREATE_DM = this.API_CHAT + 'createDM/';
	static CHAT_MESSAGES_UNREAD_FOR_USER = this.API_CHAT + 'messages/unreadsforuser/';
	static CHAT_UNREAD_MESSAGES_FROM_FRIENDS = this.API_CHAT + 'unreadMessagesFromFriends/';
	static CHAT_JOIN_ROOM_IN_DB = this.API_CHAT + 'joinRoomInDb/';
  
	static API_INVITE = this.BACKEND_BASEURL + 'invite/';
	static INVITE_RESPOND_TO_FRIEND_REQUEST = this.API_INVITE + 'respondToFriendRequest/';
	static INVITE_RESPOND_TO_GAME_REQUEST = this.API_INVITE + 'respondToGameRequest/';
  
	static API_GAME = this.BACKEND_BASEURL + 'game/'
	
	static API_TEST = this.BACKEND_BASEURL + 'test/';
	static API_TEST_BACKEND = this.API_TEST + 'backend';
	static API_TEST_FRONTEND = this.API_TEST + 'frontend';
	static API_TEST_ALL = this.API_TEST + 'all';
	static API_TEST_OUTPUT = this.API_TEST + 'output';
	static API_TEST_REPORT = this.API_TEST + 'report';
	
	static API_SWAGGER = this.BACKEND_BASEURL + 'api';
	static API_AUTH42 = this.BACKEND_BASEURL + 'auth42/';
  
  static API_STATS = this.BACKEND_BASEURL + 'stats'
  // static API_TOP_10 = this.API_STATS + 'top10/'; 
  static API_TOP_10 = this.API_USERS + 'all/'; // todo: Jorien: change code stats.tsx? so this can be set to correct endpoint
  static API_RANK = this.API_STATS + 'rank';
}
