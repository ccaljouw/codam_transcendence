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
import { ChatType, ChatUserRole, OnlineStatus } from '@prisma/client';
import { HasFriends, IsBlocked, IsFriend } from 'src/globals/functionComponents/FriendOrBlocked';
import ChannelList from './channelList';
import { ChatMessageToRoomDto, UpdateChatUserDto } from '@ft_dto/chat';
import useFetch from 'src/globals/functionComponents/useFetch';
import ChannelStatusIndicator from 'src/globals/functionComponents/channelStatus';
import ChannelSettings from './components/ChannelSettings';
import LeaveChannel from './components/LeaveChannel';
import ChannelContextMenu from './components/ChannelContextMenu';
import { transcendenceSocket } from 'src/globals/socket.globalvar';

const chatSocket = transcendenceSocket;


export default function ChatArea() {
	const enum UserListType {
		Friends = 'Friends',
		Chats = 'Chats',
		AllUsers = 'All Users',
		Channel = 'Channel',
		Settings = 'Settings'
	}
	const [secondUser, setSecondUser] = useState(0);
	const { currentUser, newChatRoom, currentChatRoom, allUsersUnreadCounter, setAllUsersUnreadCounter, friendsUnreadCounter, setFriendsUnreadCounter, setNewChatRoom } = useContext(TranscendenceContext)
	const [selectedTab, setSelectedTab] = useState<UserListType | null>(null);
	const [userListType, setUserListType] = useState<UserListType>(selectedTab ? selectedTab : (HasFriends(currentUser) ? UserListType.Friends : UserListType.AllUsers));
	const { data: chatUser, error: chatUserError, isLoading: chatUserLoading, fetcher: chatUserFetcher } = useFetch<null, UpdateChatUserDto>();
	const [refreshTrigger, setRefreshTrigger] = useState<Boolean>(false);

	useEffect(() => { // Reset secondUser when a new chat room is created to avoid the Chat component fetching the wrong room
		console.log('newChatRoom: chatarea', newChatRoom);
		if (newChatRoom.room < 0)
			(HasFriends(currentUser) ? setUserListType(UserListType.Friends) : setUserListType(UserListType.AllUsers));
		setSecondUser(-1);
	}, [newChatRoom]);


	useEffect(() => {
		if (!currentChatRoom) return;
		console.log('currentChatRoom: chatarea', currentChatRoom);
		console.log('chatArea selectedTab', selectedTab);
		if (currentChatRoom.id > 0 && currentChatRoom.visibility !== ChatType.DM) {
			if (selectedTab !== UserListType.Settings)
				setUserListType(UserListType.Channel);
		}
		if (currentChatRoom.id > 0) {
			chatUserFetcher({ url: constants.CHAT_GET_CHATUSER + currentChatRoom.id + '/' + currentUser.id });
		}
		chatSocket.on('chat/refreshList', (payload: ChatMessageToRoomDto) => {
			setRefreshTrigger(!refreshTrigger);
			console.log('chat/refreshList',refreshTrigger);
		});
		if (currentChatRoom.visibility == ChatType.DM) {
			if (IsFriend(currentChatRoom.users[0].id, currentUser) || IsFriend(currentChatRoom.users[1].id, currentUser)) {
				setUserListType(UserListType.Friends);
			}else{
				setUserListType(UserListType.AllUsers);
			}
		}
		return () => {
			chatSocket.off('chat/refreshList');
		}
	}, [currentChatRoom, currentChatRoom.users?.length, refreshTrigger]);

	useEffect(() => {
		if (newChatRoom.room === currentChatRoom.id && currentChatRoom.visibility !== ChatType.DM && currentChatRoom.id !== -1) {
			setUserListType(UserListType.Channel);
			setSelectedTab(UserListType.Channel);
		}
	}, [newChatRoom]);

	useEffect(() => {
		return () => {
			setAllUsersUnreadCounter(0);
			setFriendsUnreadCounter(0);
		}
	}, []);



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
						<ChannelStatusIndicator userId={user.id} onlineStatus={user.online} />
						&nbsp;&nbsp;
						<span className={IsBlocked(user.id, currentUser) ? 'blocked' : ''} onClick={() => { !IsBlocked(user.id, currentUser) ? setSecondUser(user.id) : setNewChatRoom({ room: -1, count: newChatRoom.count++ }) }}>{user.userName}</span>
						&nbsp;
						{chatUser?.role != ChatUserRole.DEFAULT && <ChannelContextMenu user={user} currentChatUser={chatUser} />}
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
					<span className={IsBlocked(user.id, currentUser) ? 'blocked' : ''} onClick={() => { !IsBlocked(user.id, currentUser) ? setSecondUser(user.id) : setNewChatRoom({ room: -1, count: newChatRoom.count++ }) }}>{user.userName}</span>

					&nbsp;
					<b><UnreadMessages secondUserId={user.id} indexInUserList={indexInUserList} statusChangeCallBack={statusChangeCallback} /></b>
					<UserContextMenu user={user} />
					
				</li>
			</>
		);

	}

	const renderChatContent = () => {
		if (secondUser && secondUser !== -1 || newChatRoom.room > 0) {
		  return <Chat key={newChatRoom.count} user2={secondUser} chatID={newChatRoom.room} />;
		}
	  
		switch (newChatRoom.room) {
		  case -2:
			return <div className="white-box"><h3>You were kicked from the chat {currentChatRoom.name}</h3></div>;
		  case -3:
			return <div className="white-box"><h3>You were banned from the chat {currentChatRoom.name}</h3></div>;
		  default:
			return <div className="white-box"><h3>Hello {currentUser.userName}, Who do you want to chat with?</h3></div>;
		}
	  };


	return (
		<>
			{renderChatContent()}
			<div className='chat-users white-box'>
				<div className='chat-userTypeSelect'>
					{userListType == UserListType.Friends ?
						<><span className='chat-selectedUserListType'>Friends {friendsUnreadCounter ? "(" + friendsUnreadCounter + ")" : ""}</span></>
						: <span className='chat-userListType' onClick={() => {setUserListType(UserListType.Friends); setSelectedTab(UserListType.Friends)}}>Friends {friendsUnreadCounter ? "(" + friendsUnreadCounter + ")" : ""}</span>
					} |
					{userListType == UserListType.Chats ?
						<><span className='chat-selectedUserListType'> Chats </span></>
						: <span className='chat-userListType' onClick={() => {setUserListType(UserListType.Chats); setSelectedTab(UserListType.Chats)}}> Chats </span>}
					|
					{userListType == UserListType.AllUsers ?
						<span className='chat-selectedUserListType'> All Users {allUsersUnreadCounter ? "(" + allUsersUnreadCounter + ")" : ""}</span>
						: <span className='chat-userListType' onClick={() => {setUserListType(UserListType.AllUsers); setSelectedTab(UserListType.AllUsers)}}> All Users {allUsersUnreadCounter ? "(" + allUsersUnreadCounter + ")" : ""}</span>}
					{(currentChatRoom.id !== -1 && currentChatRoom.visibility != ChatType.DM) &&
						<> |&nbsp;
							{
								userListType == UserListType.Channel ?
									<span className='chat-selectedUserListType'>Channel</span>
									: <span className='chat-userListType' onClick={() => {setUserListType(UserListType.Channel); setSelectedTab(UserListType.Channel)}}>Channel</span>
							}
							{
								chatUser && chatUser.role == ChatUserRole.OWNER &&
								<>
									&nbsp;|&nbsp;
									{userListType == UserListType.Settings ?
										<span className='chat-selectedUserListType'>Settings</span>
										: <span className='chat-userListType' onClick={() => {setUserListType(UserListType.Settings); setSelectedTab(UserListType.Settings)}}>Settings</span>
									}
								</>
							}
						</>}
				</div>
				<hr></hr>
				<div className='chat-userlist'>
					{userListType == UserListType.Friends &&
						(HasFriends(currentUser) ?
							<UserList userDisplayFunction={ChatAreaUserList} fetchUrl={constants.API_FRIENDS_FROM + currentUser.id} refreshTrigger={refreshTrigger}/>
							: <p>You have no friends<br />But don't fret: every lid has its pot!</p>)
					}
					{userListType == UserListType.Chats && <ChannelList />}
					{userListType == UserListType.AllUsers && <UserList userDisplayFunction={ChatAreaUserList} fetchUrl={constants.API_ALL_USERS_BUT_ME + currentUser.id} refreshTrigger={refreshTrigger} />}
					{userListType == UserListType.Channel && <><UserList key={currentChatRoom?.users?.length} userDisplayFunction={ChatAreaChannelUserList} fetchUrl={constants.CHAT_GET_USERS_IN_CHAT + currentChatRoom.id} refreshTrigger={refreshTrigger}/>
					<LeaveChannel room={currentChatRoom}/></>}
					{userListType == UserListType.Settings && <><ChannelSettings room={currentChatRoom} /></>}
				</div>
			</div>
		</>
	);
}
