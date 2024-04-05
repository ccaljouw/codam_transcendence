"use client";
import { useContext, useState } from 'react';
import { UserProfileDto } from '@ft_dto/users';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { constants } from '@ft_global/constants.globalvar';
import UserList from '@ft_global/functionComponents/UserList';
import StatusIndicator from '@ft_global/functionComponents/StatusIndicator';
import UnreadMessages from '@ft_global/functionComponents/UnreadMessages';
import Chat from './Chat/Chat';
import UserContextMenu from './UserLink/UserLink';
import { OnlineStatus } from '@prisma/client';
import { FontBangers } from 'src/globals/layoutComponents/Font';

export default function ChatArea() : JSX.Element {
	const [secondUser, setSecondUser] = useState<number>(0);
	const {currentUser} = useContext(TranscendenceContext);

	// Function to display users in the userlist
	const selectSecondUserDisplayFunc = (user: UserProfileDto, indexInUserList: number, statusChangeCallback: (idx: number, newStatus? : OnlineStatus) => void) => {
		return (
			<>
			<li key={user.id}>
			<StatusIndicator
					userId={user.id}
					status={user.online}
					statusChangeCallback={statusChangeCallback}
					indexInUserList={indexInUserList} /> 
			&nbsp;&nbsp;
			<span onClick={()=>setSecondUser(user.id)}>{user.firstName} {user.lastName}</span>
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
					<Chat user2={secondUser} />
				</div> : <></>
			}
			<div className="chat-users white-box">
				{secondUser? <></> : 
					<FontBangers>
						<h3>Hello {currentUser.userName}, Who do you want to chat with?</h3>
					</FontBangers>
				}
				<UserList userDisplayFunction={selectSecondUserDisplayFunc} fetchUrl={constants.API_ALL_USERS_BUT_ME + currentUser.id} />
			</div>
		</>
	);
}
