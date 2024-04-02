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
import UserContextMenu from './UserLink/UserLink';
import { FontBangers } from 'src/globals/layoutComponents/Font';

export default function ChatArea() {
	const [secondUser, setSecondUser] = useState(0);
	const {currentUser} = useContext(TranscendenceContext)

	const changeSecondUser = (userId: number) => {
		setSecondUser(userId);
	}
	// Function to display users in the userlist
	const selectSecondUserDisplayFunc = (user: UserProfileDto, indexInUserList: number, statusChangeCallback: (idx: number) => void) => {
		return (
			<>
				<li key={user.id}>
					<StatusIndicator
						userId={user.id}
						status={user.online}
						statusChangeCallback={statusChangeCallback}
						indexInUserList={indexInUserList} /> 
					&nbsp;&nbsp;
					<a onClick={() => setSecondUser(user.id)}>{user.firstName} {user.lastName}</a>
					&nbsp;
					<b><UnreadMessages secondUserId={user.id} indexInUserList={indexInUserList} statusChangeCallBack={statusChangeCallback} /></b>
					<UserContextMenu user={user} />
				</li>
			</>
		);
	}

	return (
		<>
			{secondUser?
				<div className="chat-box">
					<Chat user1={currentUser.id} user2={secondUser} />
				</div> : <></>
			}
			<div className="chat-users white-box">
				<FontBangers>
				{secondUser? <></> : 
					<h3>Hello {currentUser.userName}, Who do you want to chat with?</h3>
				}
				</FontBangers>
				<UserList userDisplayFunction={selectSecondUserDisplayFunc} fetchUrl={constants.API_ALL_USERS_BUT_ME + currentUser.id} />
			</div>
		</>
	);
}
