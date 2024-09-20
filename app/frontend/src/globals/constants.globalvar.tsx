/**
 * File for constants.
 * Import like so:
 * import {constants} from '(**)/constants.globalvar'
 * 
 * Use like so
 * const my_var_needing_constant = constants.MY_CONSTANT
*/

export class constants {

	static config = 'test';
	static themes = ['classic', 'blackAndWhite', 'neon'];

	static BACKEND_BASEURL = 'http://localhost:3001';
	static FRONTEND_BASEURL = 'http://localhost:3000';

	static API_USERS = this.BACKEND_BASEURL + '/users/';
	static API_ALL_USERS = this.API_USERS + 'all/';
	static API_ALL_USERS_BUT_ME = this.API_USERS + 'allButMe/';
	static API_ADD_TOKEN = this.API_USERS + 'token/';
	static API_FRIENDS_FROM = this.API_USERS + 'friendsFrom/';
	static API_BLOCK = this.API_USERS + 'block/';
	static API_UNBLOCK = this.API_USERS + 'unblock/';

	static API_AVATAR = this.BACKEND_BASEURL + '/avatar/';
	static API_NEW_AVATAR = this.API_AVATAR + 'new/';

	static API_CHAT = this.BACKEND_BASEURL + '/chat/';
	static CHAT_CHECK_IF_DM_EXISTS = this.API_CHAT + 'checkIfDMExists/';
	static CHAT_GET_UNREADS = this.API_CHAT + 'getUnreads/';
	static CHAT_GET_MESSAGES_FROM_CHAT = this.API_CHAT + 'messages/';
	static CHAT_CREATE_DM = this.API_CHAT + 'createDM/';
	static CHAT_MESSAGES_UNREAD_FOR_USER = this.API_CHAT + 'messages/unreadsforuser/';
	static CHAT_UNREAD_MESSAGES_FROM_FRIENDS = this.API_CHAT + 'unreadMessagesFromFriends/';
	static CHAT_JOIN_ROOM_IN_DB = this.API_CHAT + 'joinRoomInDb/';
	static CHAT_GET_USERS_IN_CHAT = this.API_CHAT + 'usersInChat/';
	static CHAT_CHANNELS_FOR_USER = this.API_CHAT + 'channelsForUser/';
	static CHAT_NEW_CHANNEL = this.API_CHAT + 'newChannel/';
	static CHAT_GET_CHANNEL_WITH_USER = this.API_CHAT + 'channelWithUser/';
	static CHAT_GET_CHATUSER = this.API_CHAT + 'chatUser/';
	static CHAT_MESSAGE_TO_DB = this.API_CHAT + 'messageToDB/';
	static CHAT_GET_CHAT_NAME = this.API_CHAT + 'name/';
	
	static API_INVITE = this.BACKEND_BASEURL + '/invite/';
	static INVITE_RESPOND_TO_FRIEND_REQUEST = this.API_INVITE + 'respondToFriendRequest/';
	static INVITE_RESPOND_TO_GAME_REQUEST = this.API_INVITE + 'respondToGameRequest/';
	static INVITE_RESPOND_TO_CHAT_REQUEST = this.API_INVITE + 'respondToChatRequest/';
  
	static API_TEST = this.BACKEND_BASEURL + '/test/';
	static API_TEST_BACKEND = this.API_TEST + 'backend';
	static API_TEST_FRONTEND = this.API_TEST + 'frontend';
	static API_TEST_ALL = this.API_TEST + 'all';
	static API_TEST_OUTPUT = this.API_TEST + 'output';
	static API_TEST_REPORT = this.API_TEST + 'report';
  
	static API_SWAGGER = this.BACKEND_BASEURL + '/api';

	static API_GAME = this.BACKEND_BASEURL + '/game/'
	static API_GETGAME = this.BACKEND_BASEURL + '/game/getGame';
	static API_GET_INVITE_GAME_ID = this.BACKEND_BASEURL + '/game/invite/';

	static API_REGISTER = this.BACKEND_BASEURL + '/auth/register/';
	static API_LOGIN = this.BACKEND_BASEURL + '/auth/login/';
	static API_AUTH42 = this.BACKEND_BASEURL + '/auth/42/';
  static API_42_USER = this.BACKEND_BASEURL + '/auth/is42User/';
	static API_CHANGEPWD = this.BACKEND_BASEURL + '/auth/change_pwd/';
	static API_CHECK_ID = this.BACKEND_BASEURL + '/auth/check_id/';
	static API_LOGOUT = this.BACKEND_BASEURL + '/auth/logout/';

	static API_AUTH_CHAT = this.BACKEND_BASEURL + '/auth/loginChat/';
	static API_AUTH_CHANGE_CHAT_PWD = this.BACKEND_BASEURL + '/auth/setChatPwd/';

	static API_ENABLE2FA = this.BACKEND_BASEURL + '/auth/2FA/enable/';
	static API_DISABLE2FA = this.BACKEND_BASEURL + '/auth/2FA/disable/';
	static API_CHECK2FATOKEN = this.BACKEND_BASEURL + '/auth/2FA/check/';

	static API_STATS = this.BACKEND_BASEURL + '/stats/';
	static API_RANK_TOP_10 = this.API_STATS + 'rank/top10/';
	static API_LADDER_TOP_10 = this.API_STATS + 'ladder/top10/';
	static API_LAST_10 = this.API_STATS + 'last10Games/';
	static API_RANK = this.API_STATS + 'rank';
	static API_LADDER_POS = this.API_STATS + 'ladderPos';
	static API_LADDER = this.API_STATS + 'ladder';
}
