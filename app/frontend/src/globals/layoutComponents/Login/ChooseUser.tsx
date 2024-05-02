"use client";
import { useContext } from 'react';
import { UserProfileDto } from '@ft_dto/users';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { constants } from '@ft_global/constants.globalvar'
import UserList from '@ft_global/functionComponents/UserList';
import { FontBangers } from 'src/globals/layoutComponents/Font';

export default function ChooseUser() : JSX.Element {
	const {setCurrentUser} = useContext(TranscendenceContext);

	const setLoggedUser = (user: UserProfileDto) => {
		console.log("Setting new user with id " + user.id + " in ChooseUser");
		setCurrentUser(user);
		sessionStorage.setItem('userId', JSON.stringify(user.id));
	}

	const setCurrentUserDisplayFunc = (user: UserProfileDto) => {
		return (
			<>
				<li key={user.id}> 
					<span onClick={() => setLoggedUser(user)}> 
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
