"use client";
import UserList from 'src/components/UserList';
import { UserProfileDto } from '../../../../../backend/src/users/dto/user-profile.dto';
import DataFetcherJson from 'src/components/DataFetcherJson';
import { constants } from 'src/globals/constants.globalvar';
import { TranscendenceContext } from 'src/globals/contextprovider.globalvar';
import { useContext } from 'react';

export default function ChooseUser() : JSX.Element { //todo: change type
	const {setCurrentUser} = useContext(TranscendenceContext);
	const setConnectionStatus = (user: UserProfileDto) => {
		console.log("I should do something with my connection status");
		sessionStorage.setItem('loginName', user.loginName); 
		sessionStorage.setItem('userName', user.userName);
		sessionStorage.setItem('userId', JSON.stringify(user.id)); //todo: do this in contextprovider?
		setCurrentUser(user);
		console.log(`User set to ${user.id}`);
	}

	const setCurrentUserDisplayFunc = (user: UserProfileDto) => {
		return (
			<li key={user.id} onClick={() => { setConnectionStatus(user);   }}>
				{user.firstName} {user.lastName} - {user.email}
			</li>
		)
	}

	const fetchAllUsers = async () : Promise<UserProfileDto[]> => {
		return DataFetcherJson({url: constants.API_ALL_USERS}); //todo: JMA: use useFetch instead of dataFetcherJson
	}

	return (
		<>
			<h1>Who do you want to be?</h1>
			<UserList userDisplayFunction={setCurrentUserDisplayFunc} userFetcherFunction={fetchAllUsers}/>
		</>
	);
}
