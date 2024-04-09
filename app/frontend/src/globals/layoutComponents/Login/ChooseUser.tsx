"use client";
import { useContext } from 'react';
import { UserProfileDto } from '@ft_dto/users';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { constants } from '@ft_global/constants.globalvar'
import UserList from '@ft_global/functionComponents/UserList';
import { FontBangers } from 'src/globals/layoutComponents/Font';

export default function ChooseUser() : JSX.Element {
	const {setCurrentUser} = useContext(TranscendenceContext);

	const setConnectionStatus = (user: UserProfileDto) => {
		console.log("I should do something with my connection status");
		sessionStorage.setItem('userId', JSON.stringify(user.id)); //todo: do this in contextprovider?
		console.log("setting userId in sessionStorage from chooseUser");
		setCurrentUser(user);
		console.log(`User set to ${user.id}`);
	}

	const setCurrentUserDisplayFunc = (user: UserProfileDto) => {
		return (
			<>
				<li key={user.id}> 
					<span onClick={() => setConnectionStatus(user)}> 
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
