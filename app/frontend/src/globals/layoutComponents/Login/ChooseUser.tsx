"use client";
import { useContext, useEffect } from 'react';
import { UserProfileDto } from '@ft_dto/users';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { constants } from '@ft_global/constants.globalvar'
import UserList from '@ft_global/functionComponents/UserList';
import { FontBangers } from 'src/globals/layoutComponents/Font';
import useFetch from 'src/globals/functionComponents/useFetch';

export default function ChooseUser() : JSX.Element {
	const {setCurrentUser} = useContext(TranscendenceContext);
	const {data: userFromDb, isLoading: userLoading, error: userError, fetcher: userFetcher} = useFetch<null, UserProfileDto>();


	useEffect(() => {
		if (userFromDb) {
			console.log("Setting current user in ChooseUser: ", userFromDb);
			setCurrentUser(userFromDb);
			sessionStorage.setItem('userId', userFromDb.id.toString());
		}
	}, [userFromDb]);

	const setLoggedUser = (userId: number) => {
		console.log("Fetching new user with id " + userId + " in ChooseUser");
		userFetcher({url: constants.API_USERS + userId});
		// setCurrentUser(user);
		// sessionStorage.setItem('userId', JSON.stringify(user.id));
	}

	const setCurrentUserDisplayFunc = (user: UserProfileDto) => {
		return (
			<>
				<li key={user.id}> 
					<span onClick={() => setLoggedUser(user.id)}> 
						{user.firstName} {user.lastName} - {user.email}
					</span>
				</li>
			</>
		)
	}

	return (
		<>
			<div className="white-box">
				<FontBangers>
					<h3>Who do you want to be?</h3>
				</FontBangers>
				<UserList userDisplayFunction={setCurrentUserDisplayFunc} fetchUrl={constants.API_ALL_USERS}/>
			</div>
		</>
	);
}
