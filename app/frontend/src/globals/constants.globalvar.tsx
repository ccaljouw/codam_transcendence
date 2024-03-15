

/**
 * File for constants.
 * Import like so:
 * import {constants} from '(**)/constants.globalvar'
 * 
 * Use like so
 * const my_var_needing_constant = constants.MY_CONSTANT
 */

export class constants{
  static BACKEND_BASEURL = 'http://localhost:3001/';
  
  static API_USERS = this.BACKEND_BASEURL + 'users/';
	static API_REGISTER = this.API_USERS + 'register/';
	static API_ALL_USERS = this.API_USERS + 'all/';
	static API_ALL_USERS_BUT_ME = this.API_USERS + 'allButMe/';

  static API_CHAT = this.BACKEND_BASEURL + 'chat/';
	static CHAT_CHECK_IF_DM_EXISTS = this.API_CHAT + 'checkIfDMExists/';
	static CHAT_GET_UNREADS = this.API_CHAT + 'getUnreads/';
	static CHAT_GET_MESSAGES_FROM_CHAT = this.API_CHAT + 'messages/';
	static CHAT_CREATE_DM = this.API_CHAT + 'createDM/';

  static API_GAME = this.BACKEND_BASEURL + 'game/'

  static API_TEST = this.BACKEND_BASEURL + 'test/';
  static API_TEST_BACKEND = this.API_TEST + 'backend';
  static API_TEST_FRONTEND = this.API_TEST + 'frontend';
  static API_TEST_ALL = this.API_TEST + 'all';
  static API_TEST_OUTPUT = this.API_TEST + 'output';
  static API_TEST_REPORT = this.API_TEST + 'report';
  
	static API_SWAGGER = this.BACKEND_BASEURL + 'api';
}
