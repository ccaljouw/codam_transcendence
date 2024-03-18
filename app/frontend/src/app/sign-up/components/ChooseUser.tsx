"use client";
import { useContext } from 'react';
import { UserProfileDto } from '@ft_dto/users';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { constants } from '@ft_global/constants.globalvar'
import UserList from '@ft_global/functionComponents/UserList';
import DataFetcherJson from '@ft_global/functionComponents/DataFetcherJson';

export default function ChooseUser() : JSX.Element {
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
		// await fetcher({url: constants.API_ALL_USERS});
		// if (users != null)
		// 	return users;
		// return {} as UserProfileDto[];
	}

	return (
		<>
			<h1>Who do you want to be?</h1>
			<UserList userDisplayFunction={setCurrentUserDisplayFunc} userFetcherFunction={fetchAllUsers}/>
		</>
	);
}
