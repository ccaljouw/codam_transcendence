"use client"
import { use, useContext, useEffect, useState } from 'react';
import { UserProfileDto } from '@ft_dto/users';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { constants } from '@ft_global/constants.globalvar';
import UserList from '@ft_global/functionComponents/UserList';
import StatusIndicator from '@ft_global/functionComponents/StatusIndicator';
import UnreadMessages from '@ft_global/functionComponents/UnreadMessages';
import Chat from './Chat';
import UserContextMenu from '../UserContextMenu/UserContextMenu';
import { OnlineStatus } from '@prisma/client';
import { HasFriends, IsFriend } from 'src/globals/functionComponents/FriendOrBlocked';


export default function ChatArea() {
	const enum UserListType {
		Friends = 'Friends',
		Chats = 'Chats',
		AllUsers = 'All Users'
	}
	const [secondUser, setSecondUser] = useState(0);
	const { currentUser, newChatRoom, messageToUserNotInRoom, allUsersUnreadCounter, setAllUsersUnreadCounter, friendsUnreadCounter, setFriendsUnreadCounter } = useContext(TranscendenceContext)
	const [userListType, setUserListType] = useState<UserListType>(HasFriends(currentUser) ? UserListType.Friends : UserListType.AllUsers);

	useEffect(() => { // Reset secondUser when a new chat room is created to avoid the Chat component fetching the wrong room
		setSecondUser(0);
	}, [newChatRoom]);

	useEffect(() => {
		return () => {
			setAllUsersUnreadCounter(0);
			setFriendsUnreadCounter(0);
		}
	}, []);

	useEffect(() => {
		if (HasFriends(currentUser)) {
			setUserListType(UserListType.Friends);
		}
	}, [currentUser]);

	useEffect(() => {
		if (allUsersUnreadCounter == 0) {
			window.document.title = "STRONGPONG";
			return
		}
		window.document.title = `STRONGPONG (${allUsersUnreadCounter}) `;


	}, [allUsersUnreadCounter]);

	useEffect(() => {
		if (messageToUserNotInRoom.room) {
			setAllUsersUnreadCounter(allUsersUnreadCounter + 1);
			if (IsFriend(messageToUserNotInRoom.userId, currentUser)) {
				setFriendsUnreadCounter(friendsUnreadCounter + 1);
			}
		}
	}, [messageToUserNotInRoom]);

	const selectSecondUserDisplayFunc = (user: UserProfileDto, indexInUserList: number, statusChangeCallback: (idx: number, newStatus?: OnlineStatus) => void) => {
		return (
			<>
				<li key={user.id}>
					<StatusIndicator
						userId={user.id}
						status={user.online}
						statusChangeCallback={statusChangeCallback}
						indexInUserList={indexInUserList} />
					&nbsp;&nbsp;
					<span onClick={() => setSecondUser(user.id)}>{user.firstName} {user.lastName}</span>
					&nbsp;
					<b><UnreadMessages secondUserId={user.id} indexInUserList={indexInUserList} statusChangeCallBack={statusChangeCallback} /></b>
					<UserContextMenu user={user} />
				</li>
			</>
		);

	}
	return (
		<>
			{secondUser || newChatRoom.room != -1 ?
				<Chat key={newChatRoom.count} user2={secondUser} chatID={newChatRoom.room} />
				: <div className="white-box"><h3>Hello {currentUser.userName}, Who do you want to chat with?</h3></div>
			}
			<div className='chat-users white-box'>
				<div className='chat-userTypeSelect'>
					{userListType == UserListType.Friends ?
						<><span className='chat-selectedUserListType'>Friends {friendsUnreadCounter ? "(" + friendsUnreadCounter + ")" : ""}</span></>
						: <span className='chat-userListType' onClick={() => setUserListType(UserListType.Friends)}>Friends {friendsUnreadCounter ? "(" + friendsUnreadCounter + ")" : ""}</span>
					} |
					{userListType == UserListType.Chats ?
						<><span className='chat-selectedUserListType'> Chats</span></>
						: <span className='chat-userListType' onClick={() => setUserListType(UserListType.Chats)}> Chats</span>}
					|
					{userListType == UserListType.AllUsers ?
						<span className='chat-selectedUserListType'> All Users {allUsersUnreadCounter ? "(" + allUsersUnreadCounter + ")" : ""}</span>
						: <span className='chat-userListType' onClick={() => setUserListType(UserListType.AllUsers)}> All Users {allUsersUnreadCounter ? "(" + allUsersUnreadCounter + ")" : ""}</span>}
				</div>
				<div className='chat-userlist'>
					{userListType == UserListType.Friends &&
						(HasFriends(currentUser) ?
							<UserList userDisplayFunction={selectSecondUserDisplayFunc} fetchUrl={constants.API_FRIENDS_FROM + currentUser.id} />
							: <p>You have no friends<br />But don't fret: every lid has its pot!</p>)
					}
					{userListType == UserListType.Chats && "Chats"}
					{userListType == UserListType.AllUsers && <UserList userDisplayFunction={selectSecondUserDisplayFunc} fetchUrl={constants.API_ALL_USERS_BUT_ME + currentUser.id} />}
				</div>
			</div>
		</>
	);
}
