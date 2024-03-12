"use client";
import UserList from 'src/components/UserList';
import { UserProfileDto } from '../../../../../backend/src/users/dto/user-profile.dto';
import DataFetcherJson from 'src/components/DataFetcherJson';
import { constants } from 'src/globals/constants.globalvar';

export default function ChooseUser({setCurrentUserId, setCurrentUserName}:{setCurrentUserId: any, setCurrentUserName: any}) { //todo: change type
	const setConnectionStatus = (user: UserProfileDto) => {
		console.log("I should do something with my connection status");
		sessionStorage.setItem('loginName', user.loginName); 
		sessionStorage.setItem('userName', user.userName);
		sessionStorage.setItem('userId', JSON.stringify(user.id));
		setCurrentUserId(user.id); 
		setCurrentUserName(user.userName);
		console.log(`User set to ${user.id}`)
	}

	const setCurrentUserDisplayFunc = (user: UserProfileDto) => {
		return (
			<li key={user.id} onClick={() => { setConnectionStatus(user);   }}>
				{user.firstName} {user.lastName} - {user.email}
			</li>
		)
	}

	const fetchAllUsers = async () : Promise<UserProfileDto[]> => {
		return DataFetcherJson({url: constants.API_ALL_USERS});
	}
	return (
		<>
			<h1>Who do you want to be?</h1>
			<UserList userDisplayFunction={setCurrentUserDisplayFunc} userFetcherFunction={fetchAllUsers}/>
		</>
	);
}
