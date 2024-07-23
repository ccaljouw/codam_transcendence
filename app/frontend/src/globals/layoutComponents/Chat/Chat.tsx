"use client"
import { useContext, useEffect, useMemo, useOptimistic, useRef, useState } from 'react';
import { FetchChatMessageDto, ChatMessageToRoomDto, FetchChatDto, CreateDMDto, UpdateInviteDto, CreateChatMessageDto, UpdateChatUserDto } from '@ft_dto/chat';
import { UserProfileDto } from '@ft_dto/users';
import { constants } from '@ft_global/constants.globalvar';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { transcendenceSocket } from '@ft_global/socket.globalvar';
import { ChatType, ChatUsers, InviteStatus, InviteType, OnlineStatus } from '@prisma/client';
import useFetch from '@ft_global/functionComponents/useFetch';
import DataFetcher from '@ft_global/functionComponents/DataFetcher';
import { FontBangers } from '../Font';
import { sendMessage, joinRoom, leaveRoom } from './chatSocketFunctions';
import { fetchMessages, fetchDM, fetchChat } from './chatFetchFunctions';
import { messageParser, parserProps } from './chatMessageParser';
import { InviteSocketMessageDto } from '@ft_dto/chat';
import { inviteCallback, inviteResponseHandler } from './inviteFunctions';
import { useRouter } from 'next/navigation';

const chatSocket = transcendenceSocket;

export default function Chat({ user2, chatID: chatId }: { user2?: number, chatID?: number }) {
	const [message, setMessage] = useState('');
	const [otherUserForDm, setOtherUserForDm] = useState<number>(-1);
	const [chat, setChat] = useState<JSX.Element[]>([]);
	const firstRender = useRef(true);
	const { currentUser, someUserUpdatedTheirStatus, currentChatRoom, setCurrentChatRoom, setCurrentUser, newChatRoom, setNewChatRoom } = useContext(TranscendenceContext);
	const messageBox = useRef<HTMLDivElement>(null);
	const { data: chatFromDb, isLoading: chatLoading, error: chatError, fetcher: chatFetcher } = useFetch<CreateDMDto, FetchChatDto>();
	const { data: updatedChat, isLoading: updatedChatLoading, error: updatedChatError, fetcher: updatedChatFetcher } = useFetch<null, number>();
	const { data: chatMessages, isLoading: chatMessagesLoading, error: chatMessagesError, fetcher: chatMessagesFetcher } = useFetch<null, FetchChatMessageDto[]>();
	const { data: friendInvite, isLoading: friendInviteLoading, error: friendInviteError, fetcher: friendInviteFetcher } = useFetch<null, UserProfileDto>();
	const { data: chatInvite, isLoading: chatInviteLoading, error: chatInviteError, fetcher: chatInviteFetcher } = useFetch<null, FetchChatDto>();
	const { data: newMessage, isLoading: newMessageLoading, error: newMessageError, fetcher: newMessageFetcher } = useFetch<CreateChatMessageDto, number>();
	const { data: newUserForChannel, isLoading: newUserForChannelLoading, error: newUserForChannelError, fetcher: newUserForChannelFetcher } = useFetch<null, UpdateChatUserDto>();
	const router = useRouter();

	// ****************************************** THIS IS STUFF YOU MIGHT WANT TO ALTER, CARLOS ****************************************** //

	// THIS IS THE DATABASE FETCHER FOR GAME INVITES, IT MIGHT NEED A DIFFERENT RETURN TYPE
	const { data: gameInvite, isLoading: gameInviteLoading, error: gameInviteError, fetcher: gameInviteFetcher } = useFetch<null, UpdateInviteDto>();


	// THIS USEEFFECT TRIGGERS WHEN THE GAME INVITE IS ACCEPTED OR DENIED, AND HANDLES THE RESPONSE BY THE ONE WHO WAS INVITED AND JUST ACCEPTED OR DENIED
	useEffect(() => {
		if (!gameInvite)
			return;
		console.log("Game invite: ", gameInvite);
		if (gameInvite.state == InviteStatus.ACCEPTED) {
			const gameAcceptPayload: InviteSocketMessageDto = {
				userId: currentUser.id,
				senderId: gameInvite.senderId ? gameInvite.senderId : 0,
				accept: true,
				type: InviteType.GAME,
				directMessageId: currentChatRoom.id
			}
			chatSocket.emit('invite/inviteResponse', gameAcceptPayload);
			// This is where we would start the game.
			router.push('/game');
			console.log("Starting game");
		}
		else {
			console.log("Game invite was denied");
		}
		fetchMessages(currentChatRoom, chatMessagesFetcher, currentUser.id);
	}, [gameInvite]);

	// ****************************************** END OF STUFF YOU MIGHT WANT TO ALTER, BEGINNING OF STUFF YOU MIGHT WANNA LEAVE BE ****************************************** //


	const changeRoomStatusCallBack = (userId: number, onlineStatus: boolean) => {
		console.log("User status changed: ", userId, onlineStatus);

		let updatedUserArray : ChatUsers[] = [];
		// If the user is in the chat room, we need to update their status.
		if (currentChatRoom.users?.find(user => user.userId == userId) != undefined)
		{
		updatedUserArray = currentChatRoom.users?.map((user: ChatUsers) => {
			if (user.userId == userId) {
				console.log("User found for leave/join room: ", {...user, isInChatRoom: onlineStatus});
				return { ...user, isInChatRoom: onlineStatus }
			}
			return user;
			});
			setCurrentChatRoom({ ...currentChatRoom, users: updatedUserArray });
		}else{
			// newUserForChannelFetcher({ url: constants.CHAT_GET_CHATUSER + currentChatRoom.id + '/' + userId });
			console.log("User not found in chat room: ", userId);
			newUserForChannelFetcher({ url: constants.CHAT_GET_CHATUSER + currentChatRoom.id + '/' + userId });
			// fetchChat(chatFetcher, currentChatRoom.id, currentUser.id);
			// fetchMessages
		}
	};

	const messageParserProps: parserProps = useMemo(() => ({ // UseMemo is used to prevent the parserProps from being recreated on every render.
		inviteCallback: inviteCallback,
		currentChatRoom: currentChatRoom,
		currentUser: currentUser,
		chatSocket: chatSocket,
		friendInviteFetcher: friendInviteFetcher,
		gameInviteFetcher: gameInviteFetcher,
		chatInviteFetcher: chatInviteFetcher,
		changeRoomStatusCallback: changeRoomStatusCallBack
	}), [currentChatRoom, currentUser]);

	const handleMessageFromRoom = (payload: ChatMessageToRoomDto) => {
		const message = messageParser(payload, messageParserProps)
		if (message) {
			setChat(prevChat => [...prevChat, message]);
		}
	}

	useEffect(() => {
			console.log("Current chat room: ", currentChatRoom);
		if (currentChatRoom.id != -1) {
			chatSocket.off('chat/messageFromRoom');
			chatSocket.off('invite/inviteResponse');
			chatSocket.on('chat/messageFromRoom', handleMessageFromRoom);
			chatSocket.on('invite/inviteResponse', (payload: InviteSocketMessageDto) => { inviteResponseHandler(payload, currentUser, currentChatRoom, chatMessagesFetcher, friendInviteFetcher) });
		}
	}, [currentChatRoom])

	useEffect(() => {
		if (friendInvite && Object.keys(friendInvite).length > 0) { // If the friend invite is not empty, we need to update the user's friends list.
			setCurrentUser(friendInvite);
			const newFriend = friendInvite.friends?.find(friend => !currentUser.friends?.some(existingFriend => existingFriend.id === friend.id)); // We need to find the new friend in order to send the invite response.
			if (newFriend) // Prepare the payload for the invite response.
			{
				const newFriendPayload: InviteSocketMessageDto = {
					userId: currentUser.id,
					senderId: newFriend.id,
					accept: true,
					type: InviteType.FRIEND,
					directMessageId: currentChatRoom.id
				}
				chatSocket.emit('invite/inviteResponse', newFriendPayload); // Send invite response
			}
		}
		// Reload the chat messages to update the invite.
		fetchMessages(currentChatRoom, chatMessagesFetcher, currentUser.id);
	}, [friendInvite]);

	useEffect(() => {
		if (updatedChat && updatedChat != -1 && updatedChat == chatFromDb?.id) {
			fetchMessages(chatFromDb, chatMessagesFetcher, currentUser.id);
		}
	}, [updatedChat]);

	// This effect is used to set up the chat and join the room when the component is rendered.
	useEffect(() => {
		// If we don't have a user2 or a chatID, we can't create a chat.
		if (!user2 && (!chatId || chatId === -1))
			return;
		if (firstRender.current) // This is to ensure that the chat is only created once.
		{
			firstRender.current = false;
			if (user2 && user2 != otherUserForDm) {
				setOtherUserForDm(user2);
				fetchDM(chatFetcher, currentUser.id, user2) // This will set the chatID.
			}
			else if (chatId && chatId !== -1) // If we have a chatid, we need to fetch the chat messages for it
			{
				fetchChat(chatFetcher, chatId, currentUser.id);

			}
			chatSocket.on('chat/messageFromRoom', handleMessageFromRoom);
			chatSocket.on('invite/inviteResponse', (payload: InviteSocketMessageDto) => { inviteResponseHandler(payload, currentUser, currentChatRoom, chatMessagesFetcher, friendInviteFetcher) });
			chatSocket.on('chat/patch', (payload: FetchChatDto) => {
				console.log("Chat patched (socket): ", payload);
				console.log("Id (socket)", payload.id);
				if (payload.action == "patch")
					fetchChat(chatFetcher, payload.id, currentUser.id);
				else if (payload.action == "delete_user")
				{
					console.log("User was deleted from the chat room", payload);
					if (payload.users.find(user => user.userId == currentUser.id) != undefined)
					{
						console.log("Someone else was deleted from the chat room");
						setCurrentChatRoom(payload);
						// fetchChat(chatFetcher, payload.id, currentUser.id);
					}
				}

			});
		}
		return () => {
			chatSocket.off('chat/messageFromRoom');
			chatSocket.off('invite/inviteResponse')
			setCurrentChatRoom({ id: -1, name: '', visibility: ChatType.PUBLIC, users: [], ownerId: 0 });
		};
	}, [chatId, user2, firstRender.current]);

	// This effect is used to update the chat when a user changes their status.
	useEffect(() => {
		if (someUserUpdatedTheirStatus && someUserUpdatedTheirStatus.userId == otherUserForDm) {
			const statusMessage = <>{'<<'} {someUserUpdatedTheirStatus.userName} {(someUserUpdatedTheirStatus.status == OnlineStatus.ONLINE ? 'is online' : 'went offline')}  {'>>'}</>
			setChat(prevChat => [...prevChat, statusMessage]);
		}
	}, [someUserUpdatedTheirStatus]);

	// This effect is used to join the room when the chatId changes.
	useEffect(() => {
		if (!chatFromDb)
			return;
		if (chatId && chatId !== -1) {
			if (chatFromDb.visibility == ChatType.DM && chatFromDb.users) {
				for (const user of chatFromDb.users) {
					if (user.userId != currentUser.id) {
						setOtherUserForDm(user.userId);
					}
				}
			}
		}
		if (chatFromDb.id) {
			joinRoom(currentUser.id, chatFromDb, currentUser, currentChatRoom, updatedChatFetcher, inviteResponseHandler);
		}

	}, [chatFromDb])

	useEffect(() => {
		const newUser = newUserForChannel as ChatUsers;
		console.log("New user for channel: ", newUser);
		if (newUser) {
			newUser.isInChatRoom = true;
			const newChatUsers = currentChatRoom.users?.concat(newUser);
			setCurrentChatRoom({ ...currentChatRoom, users: newChatUsers });
			console.log(currentChatRoom.users);
		}
	}, [newUserForChannel]);

	// This effect is used to leave the room and reset the chat when the user2 changes.
	useEffect(() => {
		if (chatFromDb?.id)
			leaveRoom(currentUser.id, chatFromDb, currentUser, setCurrentChatRoom);
		if (!firstRender.current)
			firstRender.current = true;
	}, [user2, chatId]);

	// This effect is used to scroll to the bottom of the chat when the chat changes.
	useEffect(() => {
		if (messageBox.current) {
			const { scrollHeight, clientHeight } = messageBox.current;
			messageBox.current.scrollTop = scrollHeight - clientHeight;
		}
	}, [chat])

	useEffect(() => {
		if (!chatMessages)
			return;
		if (chatFromDb) {
			setCurrentChatRoom(chatFromDb); // Update the current chat room. Ths is the only place where this should be updated.
			setChat(chatMessages.map((message: FetchChatMessageDto) => {
				const dbMessageForParser: ChatMessageToRoomDto = {
					userId: message.userId,
					userName: message.userName,
					room: chatFromDb.id.toString(),
					message: message.message,
					action: false,
					inviteId: message.inviteId,
					invite: message.invite
				}
				const parsedMessage = messageParser(dbMessageForParser, messageParserProps);
				if (parsedMessage)
					return parsedMessage;
				return <></>
			}
			));
		}
	}, [chatMessages])


	return (
		<>
			<div className="white-box chat-box">
				{chatLoading && <>Chat is loading</>}
				{chatError && <>Error loading chat</>}
				{chatFromDb && <>
					<div className="chat-title">
						{
							chatFromDb?.visibility == ChatType.DM ?
								<FontBangers>
									<h4>DM: {currentUser.userName} and&nbsp;
										{otherUserForDm != -1 && <DataFetcher<UserProfileDto, UserProfileDto>
											url={constants.API_USERS + otherUserForDm}
											showData={(data: UserProfileDto) => <>{data.userName}</>}
											showLoading={<></>}
										/>}
									</h4>
								</FontBangers>
								: <>
									<FontBangers>
										<h4>Channel: {chatFromDb?.name}</h4>
									</FontBangers>
								</>
						}
					</div>
					<div className="chat-messages" ref={messageBox}>
						{chatMessagesLoading && <>Chat messages are loading</>}
						{chatMessagesError && <>Error loading chat messages</>}
						{chatMessages ? chat.map((message, index) => (
							<p key={index}>{message}</p>
						)) : <></>}
					</div>
					<div className="chat-input">
						<form onSubmit={(e) => {
							e.preventDefault();
							sendMessage(currentUser.id, otherUserForDm ? otherUserForDm : 0, chatFromDb, currentUser, message, chatSocket, setMessage, newMessageFetcher);
						}}>
							<input className="form-control"
								type='text'
								value={message}
								onChange={(e) => setMessage(e.target.value)}
							/><button className="btn btn-dark" type='submit' disabled={message.length > 0 ? false : true}>send</button>
						</form>
					</div>
				</>}
			</div>
		</>
	);
}
