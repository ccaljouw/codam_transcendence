/**
 * File for constants.
 * Import like so:
 * import {constants} from '(**)/constants.globalvar'
 * 
 * Use like so
 * const my_var_needing_constant = constants.MY_CONSTANT
*/

// 

export class constants {
  // Static properties
  static BACKEND_BASEURL: string;
  static FRONTEND_BASEURL: string;
  static config: string;
  static themes: string[];

  // API Endpoints
  static API_USERS: string;
  static API_ALL_USERS: string;
  static API_ALL_USERS_BUT_ME: string;
  static API_ADD_TOKEN: string;
  static API_FRIENDS_FROM: string;
  static API_BLOCK: string;
  static API_UNBLOCK: string;

  static API_AVATAR: string;
  static API_NEW_AVATAR: string;

  static API_CHAT: string;
  static CHAT_CHECK_IF_DM_EXISTS: string;
  static CHAT_GET_UNREADS: string;
  static CHAT_GET_MESSAGES_FROM_CHAT: string;
  static CHAT_CREATE_DM: string;
  static CHAT_MESSAGES_UNREAD_FOR_USER: string;
  static CHAT_UNREAD_MESSAGES_FROM_FRIENDS: string;
  static CHAT_JOIN_ROOM_IN_DB: string;
  static CHAT_GET_USERS_IN_CHAT: string;
  static CHAT_CHANNELS_FOR_USER: string;
  static CHAT_NEW_CHANNEL: string;
  static CHAT_GET_CHANNEL_WITH_USER: string;
  static CHAT_GET_CHATUSER: string;
  static CHAT_MESSAGE_TO_DB: string;
  static CHAT_GET_CHAT_NAME: string;
  static CHAT_CHANGE_USER_ROLE: string;
  static CHAT_KICK_USER: string;
  static CHAT_MUTE_USER: string;
  static CHAT_BAN_USER: string;

  static API_INVITE: string;
  static INVITE_RESPOND_TO_FRIEND_REQUEST: string;
  static INVITE_RESPOND_TO_GAME_REQUEST: string;
  static INVITE_RESPOND_TO_CHAT_REQUEST: string;

  static API_TEST: string;
  static API_TEST_BACKEND: string;
  static API_TEST_FRONTEND: string;
  static API_TEST_ALL: string;
  static API_TEST_OUTPUT: string;
  static API_TEST_REPORT: string;

  static API_SWAGGER: string;

  static API_GAME: string;
  static API_GETGAME: string;
  static API_GET_INVITE_GAME_ID: string;

  static API_REGISTER: string;
  static API_LOGIN: string;
  static API_AUTH42: string;
  static API_42_USER: string;
  static API_CHANGEPWD: string;
  static API_CHECK_ID: string;
  static API_LOGOUT: string;

  static API_AUTH_CHAT: string;
  static API_AUTH_CHANGE_CHAT_PWD: string;

  static API_ENABLE2FA: string;
  static API_DISABLE2FA: string;
  static API_CHECK2FATOKEN: string;

  static API_STATS: string;
  static API_RANK_TOP_10: string;
  static API_LADDER_TOP_10: string;
  static API_LAST_10: string;
  static API_RANK: string;
  static API_LADDER_POS: string;
  static API_LADDER: string;

  // Static initialization method
  static init() {
    // Initialize the base URLs from environment variables
    constants.BACKEND_BASEURL = process.env.NEXT_PUBLIC_BACKEND_BASEURL || 'http://192.168.178.30:3001';
    constants.FRONTEND_BASEURL = process.env.NEXT_PUBLIC_FRONTEND_BASEURL || 'http://192.168.178.30:3000';

    // Initialize other constants
    constants.config = process.env.NEXT_PUBLIC_CONFIG || 'standard';
    constants.themes = process.env.NEXT_PUBLIC_THEMES?.split(',') || ['classic', 'blackAndWhite', 'neon'];

    // Initialize API endpoints based on BACKEND_BASEURL
    constants.API_USERS = `${constants.BACKEND_BASEURL}/users/`;
    constants.API_ALL_USERS = `${constants.API_USERS}all/`;
    constants.API_ALL_USERS_BUT_ME = `${constants.API_USERS}allButMe/`;
    constants.API_ADD_TOKEN = `${constants.API_USERS}token/`;
    constants.API_FRIENDS_FROM = `${constants.API_USERS}friendsFrom/`;
    constants.API_BLOCK = `${constants.API_USERS}block/`;
    constants.API_UNBLOCK = `${constants.API_USERS}unblock/`;

    constants.API_AVATAR = `${constants.BACKEND_BASEURL}/avatar/`;
    constants.API_NEW_AVATAR = `${constants.API_AVATAR}new/`;

    constants.API_CHAT = `${constants.BACKEND_BASEURL}/chat/`;
    constants.CHAT_CHECK_IF_DM_EXISTS = `${constants.API_CHAT}checkIfDMExists/`;
    constants.CHAT_GET_UNREADS = `${constants.API_CHAT}getUnreads/`;
    constants.CHAT_GET_MESSAGES_FROM_CHAT = `${constants.API_CHAT}messages/`;
    constants.CHAT_CREATE_DM = `${constants.API_CHAT}createDM/`;
    constants.CHAT_MESSAGES_UNREAD_FOR_USER = `${constants.API_CHAT}messages/unreadsforuser/`;
    constants.CHAT_UNREAD_MESSAGES_FROM_FRIENDS = `${constants.API_CHAT}unreadMessagesFromFriends/`;
    constants.CHAT_JOIN_ROOM_IN_DB = `${constants.API_CHAT}joinRoomInDb/`;
    constants.CHAT_GET_USERS_IN_CHAT = `${constants.API_CHAT}usersInChat/`;
    constants.CHAT_CHANNELS_FOR_USER = `${constants.API_CHAT}channelsForUser/`;
    constants.CHAT_NEW_CHANNEL = `${constants.API_CHAT}newChannel/`;
    constants.CHAT_GET_CHANNEL_WITH_USER = `${constants.API_CHAT}channelWithUser/`;
    constants.CHAT_GET_CHATUSER = `${constants.API_CHAT}chatUser/`;
    constants.CHAT_MESSAGE_TO_DB = `${constants.API_CHAT}messageToDB/`;
    constants.CHAT_GET_CHAT_NAME = `${constants.API_CHAT}name/`;
    constants.CHAT_CHANGE_USER_ROLE = `${constants.API_CHAT}changeChatUserRole/`;
    constants.CHAT_KICK_USER = `${constants.API_CHAT}kickUser/`;
    constants.CHAT_MUTE_USER = `${constants.API_CHAT}mute/`;
    constants.CHAT_BAN_USER = `${constants.API_CHAT}ban/`;

    constants.API_INVITE = `${constants.BACKEND_BASEURL}/invite/`;
    constants.INVITE_RESPOND_TO_FRIEND_REQUEST = `${constants.API_INVITE}respondToFriendRequest/`;
    constants.INVITE_RESPOND_TO_GAME_REQUEST = `${constants.API_INVITE}respondToGameRequest/`;
    constants.INVITE_RESPOND_TO_CHAT_REQUEST = `${constants.API_INVITE}respondToChatRequest/`;

    constants.API_TEST = `${constants.BACKEND_BASEURL}/test/`;
    constants.API_TEST_BACKEND = `${constants.API_TEST}backend`;
    constants.API_TEST_FRONTEND = `${constants.API_TEST}frontend`;
    constants.API_TEST_ALL = `${constants.API_TEST}all`;
    constants.API_TEST_OUTPUT = `${constants.API_TEST}output`;
    constants.API_TEST_REPORT = `${constants.API_TEST}report`;

    constants.API_SWAGGER = `${constants.BACKEND_BASEURL}/api`;

    constants.API_GAME = `${constants.BACKEND_BASEURL}/game/`;
    constants.API_GETGAME = `${constants.BACKEND_BASEURL}/game/getGame`;
    constants.API_GET_INVITE_GAME_ID = `${constants.BACKEND_BASEURL}/game/invite/`;

    constants.API_REGISTER = `${constants.BACKEND_BASEURL}/auth/register/`;
    constants.API_LOGIN = `${constants.BACKEND_BASEURL}/auth/login/`;
    constants.API_AUTH42 = `${constants.BACKEND_BASEURL}/auth/42/`;
    constants.API_42_USER = `${constants.BACKEND_BASEURL}/auth/is42User/`;
    constants.API_CHANGEPWD = `${constants.BACKEND_BASEURL}/auth/change_pwd/`;
    constants.API_CHECK_ID = `${constants.BACKEND_BASEURL}/auth/check_id/`;
    constants.API_LOGOUT = `${constants.BACKEND_BASEURL}/auth/logout/`;

    constants.API_AUTH_CHAT = `${constants.BACKEND_BASEURL}/auth/loginChat/`;
    constants.API_AUTH_CHANGE_CHAT_PWD = `${constants.BACKEND_BASEURL}/auth/setChatPwd/`;

    constants.API_ENABLE2FA = `${constants.BACKEND_BASEURL}/auth/2FA/enable/`;
    constants.API_DISABLE2FA = `${constants.BACKEND_BASEURL}/auth/2FA/disable/`;
    constants.API_CHECK2FATOKEN = `${constants.BACKEND_BASEURL}/auth/2FA/check/`;

    constants.API_STATS = `${constants.BACKEND_BASEURL}/stats/`;
    constants.API_RANK_TOP_10 = `${constants.API_STATS}rank/top10/`;
    constants.API_LADDER_TOP_10 = `${constants.API_STATS}ladder/top10/`;
    constants.API_LAST_10 = `${constants.API_STATS}last10Games/`;
    constants.API_RANK = `${constants.API_STATS}rank`;
    constants.API_LADDER_POS = `${constants.API_STATS}ladderPos`;
    constants.API_LADDER = `${constants.API_STATS}ladder`;
  }
}

// Call the static init method to initialize static variables
constants.init();

// Example of accessing the constants
console.log(constants.BACKEND_BASEURL);  // e.g., 'http://192.168.178.30:3001'
console.log(constants.FRONTEND_BASEURL);  // e.g., 'http://192.168.178.30:3000'
console.log(constants.config);              // e.g., 'standard'
console.log(constants.themes);              // e.g., ['classic', 'blackAndWhite', 'neon']
