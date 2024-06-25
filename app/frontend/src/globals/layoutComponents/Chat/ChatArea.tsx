"use client"
import { useContext, useEffect, useState } from 'react';
import { UserProfileDto } from '@ft_dto/users';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { constants } from '@ft_global/constants.globalvar';
import UserList from '@ft_global/functionComponents/UserList';
import StatusIndicator from '@ft_global/functionComponents/StatusIndicator';
import UnreadMessages from '@ft_global/functionComponents/UnreadMessages';
import Chat from './Chat';
import UserContextMenu from '../UserContextMenu/UserContextMenu';
import { ChatType, OnlineStatus } from '@prisma/client';
import { HasFriends, IsBlocked } from 'src/globals/functionComponents/FriendOrBlocked';
import ChannelList from './channelList';



export default function ChatArea() {
	const enum UserListType {
		Friends = 'Friends',
		Chats = 'Chats',
		AllUsers = 'All Users',
		Channel = 'Channel'
	}
	const [secondUser, setSecondUser] = useState(0);
	const { currentUser, newChatRoom, currentChatRoom, allUsersUnreadCounter, setAllUsersUnreadCounter, friendsUnreadCounter, setFriendsUnreadCounter, setNewChatRoom } = useContext(TranscendenceContext)
	const [userListType, setUserListType] = useState<UserListType>(HasFriends(currentUser) ? UserListType.Friends : UserListType.AllUsers);

	useEffect(() => { // Reset secondUser when a new chat room is created to avoid the Chat component fetching the wrong room
		setSecondUser(0);
	}, [newChatRoom]);


	useEffect(() => {
		if (!currentChatRoom) return;
		if (currentChatRoom.id != -1 && currentChatRoom.visibility !== ChatType.DM) {
			setUserListType(UserListType.Channel);
		}
	}, [currentChatRoom]);

	useEffect(() => {
		if (newChatRoom.room === currentChatRoom.id && currentChatRoom.visibility !== ChatType.DM) {
			setUserListType(UserListType.Channel);
		}
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
		else
			setUserListType(UserListType.AllUsers);
	}, [currentUser]);

	useEffect(() => {
		if (allUsersUnreadCounter == 0) {
			window.document.title = "STRONGPONG";
			return
		}
		window.document.title = `STRONGPONG (${allUsersUnreadCounter}) `;
	}, [allUsersUnreadCounter]);

	const ChatAreaChannelUserList = (user: UserProfileDto, indexInUserList: number, statusChangeCallback: (idx: number, newStatus?: OnlineStatus) => void) => {
		return (
			user.id == currentUser.id ?
				<>
					<li key={user.id}>Yourself</li>
				</>
				:
				<>
					<li key={user.id}>
						{/* TODO: Implement status StatusIndicator for channels */}
						{/* <StatusIndicator
							userId={user.id}
							status={user.online}
							statusChangeCallback={statusChangeCallback}
							indexInUserList={indexInUserList} /> */}
						&nbsp;&nbsp;
						<span className={IsBlocked(user.id, currentUser) ? 'blocked' : ''} onClick={() => { !IsBlocked(user.id, currentUser) ? setSecondUser(user.id) : setNewChatRoom({ room: -1, count: newChatRoom.count++ }) }}>{user.firstName} {user.lastName}</span>
						&nbsp;
						{/* TODO: implement proper context menu for channels */}
						<UserContextMenu user={user} />
					</li>
				</>
		);
	}


	const ChatAreaUserList = (user: UserProfileDto, indexInUserList: number, statusChangeCallback: (idx: number, newStatus?: OnlineStatus) => void) => {
		return (
			<>
				<li key={user.id}>
					<StatusIndicator
						userId={user.id}
						status={user.online}
						statusChangeCallback={statusChangeCallback}
						indexInUserList={indexInUserList} />
					&nbsp;&nbsp;
					<span className={IsBlocked(user.id, currentUser) ? 'blocked' : ''} onClick={() => { !IsBlocked(user.id, currentUser) ? setSecondUser(user.id) : setNewChatRoom({ room: -1, count: newChatRoom.count++ }) }}>{user.firstName} {user.lastName}</span>

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
						<><span className='chat-selectedUserListType'> Chats </span></>
						: <span className='chat-userListType' onClick={() => setUserListType(UserListType.Chats)}> Chats </span>}
					|
					{userListType == UserListType.AllUsers ?
						<span className='chat-selectedUserListType'> All Users {allUsersUnreadCounter ? "(" + allUsersUnreadCounter + ")" : ""}</span>
						: <span className='chat-userListType' onClick={() => setUserListType(UserListType.AllUsers)}> All Users {allUsersUnreadCounter ? "(" + allUsersUnreadCounter + ")" : ""}</span>}
					{(currentChatRoom.id !== -1 && currentChatRoom.visibility != ChatType.DM) &&
						<> |&nbsp;
							{
								userListType == UserListType.Channel ?
									<span className='chat-selectedUserListType'>Channel</span>
									: <span className='chat-userListType' onClick={() => setUserListType(UserListType.Channel)}>Channel</span>
							}
						</>}
				</div>
				<div className='chat-userlist'>
					{userListType == UserListType.Friends &&
						(HasFriends(currentUser) ?
							<UserList userDisplayFunction={ChatAreaUserList} fetchUrl={constants.API_FRIENDS_FROM + currentUser.id} />
							: <p>You have no friends<br />But don't fret: every lid has its pot!</p>)
					}
					{userListType == UserListType.Chats && <ChannelList />}
					{userListType == UserListType.AllUsers && <UserList userDisplayFunction={ChatAreaUserList} fetchUrl={constants.API_ALL_USERS_BUT_ME + currentUser.id} />}
					{userListType == UserListType.Channel && <><UserList userDisplayFunction={ChatAreaChannelUserList} fetchUrl={constants.CHAT_GET_USERS_IN_CHAT + currentChatRoom.id} /></>}
				</div>
			</div>
		</>
	);
}
