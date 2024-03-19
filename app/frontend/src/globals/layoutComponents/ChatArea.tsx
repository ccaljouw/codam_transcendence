"use client"
import { useContext, useEffect, useState } from 'react';
import { UserProfileDto } from '@ft_dto/users';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { constants } from '@ft_global/constants.globalvar';
import UserList from '@ft_global/functionComponents/UserList';
// import DataFetcherJson from '@ft_global/functionComponents/DataFetcherJson';
import StatusIndicator from '@ft_global/functionComponents/StatusIndicator';
import UnreadMessages from '@ft_global/functionComponents/UnreadMessages';
import Chat from './Chat';

export default function ChatArea() {
	const [secondUser, setSecondUser] = useState(0);
	const {currentUser} = useContext(TranscendenceContext)

	// Function to display users in the userlist
	const selectSecondUserDisplayFunc = (user: UserProfileDto, indexInUserList: number, statusChangeCallback: (idx: number) => void) => {
		return (
			<li key={user.id} onClick={() => { setSecondUser(user.id); console.log(`Second user set to ${user.id}`) }}>
				<StatusIndicator
					userId={user.id}
					status={user.online}
					statusChangeCallback={statusChangeCallback}
					indexInUserList={indexInUserList} /> {user.firstName} {user.lastName} - {user.email}
				<b> <UnreadMessages secondUserId={user.id} indexInUserList={indexInUserList} statusChangeCallBack={statusChangeCallback} /></b>
			</li>
		)
	}


	return (
		<>
			{secondUser ?
				<Chat user1={currentUser.id} user2={secondUser} />
				: <><h3>Hello {currentUser.userName}, Who do you wanna chat with?</h3></>
			}
			<UserList userDisplayFunction={selectSecondUserDisplayFunc} fetchUrl={constants.API_ALL_USERS_BUT_ME + currentUser.id} />
		</>
	)

}