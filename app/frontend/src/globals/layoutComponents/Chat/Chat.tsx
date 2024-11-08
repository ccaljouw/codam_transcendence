"use client"
import { useContext, useEffect, useMemo, useOptimistic, useRef, useState } from 'react';
import { FetchChatMessageDto, ChatMessageToRoomDto, FetchChatDto, CreateDMDto, UpdateInviteDto, CreateChatMessageDto, UpdateChatUserDto } from '@ft_dto/chat';
import { UserProfileDto } from '@ft_dto/users';
import { constants } from '@ft_global/constants.globalvar';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { transcendenceSocket } from '@ft_global/socket.globalvar';
import { ChatType, ChatUsers, GameState, InviteStatus, InviteType, OnlineStatus } from '@prisma/client';
import useFetch from '@ft_global/functionComponents/useFetch';
import DataFetcher from '@ft_global/functionComponents/DataFetcher';
import { FontBangers } from '../Font';
import { sendMessage, joinRoom, leaveRoom } from './chatSocketFunctions';
import { fetchMessages, fetchDM, fetchChat } from './chatFetchFunctions';
import { messageParser, parserProps } from './chatMessageParser';
import { InviteSocketMessageDto } from '@ft_dto/chat';
import { useRouter } from 'next/navigation';
import { inviteCallback, inviteResponseHandler } from './inviteFunctions/inviteFunctions';
import { GetGameDto, UpdateGameDto, UpdateGameStateDto } from '@ft_dto/game';
import EditableDataField from 'src/app/(general)/profile/[username]/components/utils/EditableDataField';
import { ChatAuthDto } from '@ft_dto/authentication/chat-auth.dto';

const chatSocket = transcendenceSocket;
const gameSocket = transcendenceSocket;

export default function Chat({ user2, chatID: chatId }: { user2?: number, chatID?: number }) {
	const [message, setMessage] = useState('');
	const [otherUserForDm, setOtherUserForDm] = useState<number>(-1);
	const [chat, setChat] = useState<JSX.Element[]>([]);
	// const firstRender = useRef(true);
	const { currentUser, someUserUpdatedTheirStatus, currentChatRoom, setCurrentChatRoom, setCurrentUser, newChatRoom, setNewChatRoom, switchToChannelCounter, setSwitchToChannelCounter } = useContext(TranscendenceContext);
	const messageBox = useRef<HTMLDivElement>(null);
	const { data: chatFromDb, isLoading: chatLoading, error: chatError, fetcher: chatFetcher } = useFetch<any, FetchChatDto>();
	const { data: updatedChat, isLoading: updatedChatLoading, error: updatedChatError, fetcher: updatedChatFetcher } = useFetch<null, number>();
	const { data: chatMessages, isLoading: chatMessagesLoading, error: chatMessagesError, fetcher: chatMessagesFetcher } = useFetch<null, FetchChatMessageDto[]>();
	const { data: friendInvite, isLoading: friendInviteLoading, error: friendInviteError, fetcher: friendInviteFetcher } = useFetch<null, UserProfileDto>();
	const { data: chatInvite, isLoading: chatInviteLoading, error: chatInviteError, fetcher: chatInviteFetcher } = useFetch<null, UpdateInviteDto>();
	const { data: newMessage, isLoading: newMessageLoading, error: newMessageError, fetcher: newMessageFetcher } = useFetch<CreateChatMessageDto, number>();
	const { data: newUserForChannel, isLoading: newUserForChannelLoading, error: newUserForChannelError, fetcher: newUserForChannelFetcher } = useFetch<null, UpdateChatUserDto>();
	const { data: chatAuth, isLoading: chatAuthLoading, error: chatAuthError, fetcher: chatAuthFetcher } = useFetch<ChatAuthDto, null>();
	const router = useRouter();


	// THIS IS THE DATABASE FETCHER FOR GAME INVITES, IT MIGHT NEED A DIFFERENT RETURN TYPE
	const { data: gameInvite, isLoading: gameInviteLoading, error: gameInviteError, fetcher: gameInviteFetcher } = useFetch<null, UpdateInviteDto>();
	const { data: gameData, isLoading: loadingGame, error: errorGame, fetcher: getIviteGameID } = useFetch<null, number>();
	// const [payloadGameState, setPayload] = useState<UpdateGameStateDto>();


	// THIS USEEFFECT TRIGGERS WHEN THE GAME INVITE IS ACCEPTED OR DENIED, AND HANDLES THE RESPONSE BY THE ONE WHO WAS INVITED AND JUST ACCEPTED OR DENIED
	useEffect(() => {
		if (gameData !== null) {
			console.log('Sending gameStateUpdate after rejected invite');
			gameSocket.emit("game/updateGameState", { id: gameData, state: GameState.REJECTED });
		} else
			console.log('Error, no gameData');
	}, [gameData]);

	useEffect(() => {
		if (!gameInvite)
			return;
		console.log("Game invite received: ", gameInvite);
		if (gameInvite.state == InviteStatus.ACCEPTED && chatSocket.id) {
			const gameAcceptPayload: InviteSocketMessageDto = {
				userId: currentUser.id,
				senderId: gameInvite.senderId ? gameInvite.senderId : 0,
				accept: true,
				type: InviteType.GAME,
				directMessageId: currentChatRoom.id
			}
			chatSocket.emit('invite/inviteResponse', gameAcceptPayload);
			console.log("Game invite was accepted");
			console.log("Starting game");
			router.push(`/game/${gameInvite.id}`);
		} else {
			getIviteGameID({ url: `${constants.API_GET_INVITE_GAME_ID}${gameInvite.id}` });
			console.log("Game invite was denied");
		}
		fetchMessages(currentChatRoom, chatMessagesFetcher, currentUser.id);
	}, [gameInvite]);

	// ****************************************** END OF STUFF YOU MIGHT WANT TO ALTER, BEGINNING OF STUFF YOU MIGHT WANNA LEAVE BE ****************************************** //

	useEffect(() => { // UseEffect is used to handle the CHAT invite response from the invitee.
		if (!chatInvite)
			return;
		const chatAcceptPayload: InviteSocketMessageDto = {
			userId: currentUser.id,
			senderId: chatInvite.senderId ? chatInvite.senderId : 0,
			accept: true,
			type: InviteType.CHAT,
			directMessageId: currentChatRoom.id,
			channelId: chatInvite.chatId
		}
		chatSocket.emit('invite/inviteResponse', chatAcceptPayload);
		// Refresh the chat messages to update the invite displayed.
		// fetchMessages(currentChatRoom, chatMessagesFetcher, currentUser.id);
		if (chatInvite.chatId && currentChatRoom.id != chatInvite.chatId) {
			// setOtherUserForDm(-1);
			// console.log("Leaving room: ", currentChatRoom);
			// leaveRoom(currentUser.id, currentChatRoom, currentUser, setCurrentChatRoom);
			// fetchChat(chatFetcher, chatInvite.chatId, currentUser.id);
			console.log("Joining room: ", chatInvite.chatId);
			setNewChatRoom({ room: chatInvite.chatId, count: newChatRoom.count + 1 });
		}
	}, [chatInvite]);

	const changeRoomStatusCallBack = (userId: number, onlineStatus: boolean) => {
		console.log("User status changed: ", userId, onlineStatus);

		let updatedUserArray: ChatUsers[] = [];
		// If the user is in the chat room, we need to update their status.
		if (currentChatRoom.users?.find(user => user.userId == userId) != undefined) {
			updatedUserArray = currentChatRoom.users?.map((user: ChatUsers) => {
				if (user.userId == userId) {
					console.log("User found for leave/join room: ", { ...user, isInChatRoom: onlineStatus });
					return { ...user, isInChatRoom: onlineStatus }
				}
				return user;
			});
			setCurrentChatRoom({ ...currentChatRoom, users: updatedUserArray });
		} else {
			console.log("User not found in chat room: ", userId);
			newUserForChannelFetcher({ url: constants.CHAT_GET_CHATUSER + currentChatRoom.id + '/' + userId });
		}
	};
	
	const userKickedCallback = (channel: number) => {
		console.log("Kick callback: ", channel);
		leaveRoom(currentUser.id, currentChatRoom, currentUser, setCurrentChatRoom);
		setNewChatRoom({ room: channel, count: newChatRoom.count + 1 });
	}

	const messageParserProps: parserProps = {
		inviteCallback: inviteCallback,
		currentChatRoom: currentChatRoom,
		currentUser: currentUser,
		chatSocket: chatSocket,
		friendInviteFetcher: friendInviteFetcher,
		gameInviteFetcher: gameInviteFetcher,
		chatInviteFetcher: chatInviteFetcher,
		changeRoomStatusCallback: changeRoomStatusCallBack,
		userKickedCallback: userKickedCallback
	};

	const handleMessageFromRoom = (payload: ChatMessageToRoomDto) => {
		console.log("Message from room: ", payload,);
		console.log("Current chat room: (msg) ", currentChatRoom);
		const message = messageParser(payload, messageParserProps)
		if (message) {
			setChat(prevChat => [...prevChat, message]);
		}
	}

	useEffect(() => {
		console.log("Current chat room: ", currentChatRoom);
		if (currentChatRoom.id != -1) {
			setSwitchToChannelCounter({ channel: -1, count: 0, invite: -1 });
			chatSocket.off('chat/messageFromRoom');
			chatSocket.off('invite/inviteResponse');
			chatSocket.on('chat/messageFromRoom', handleMessageFromRoom);
			chatSocket.on('invite/inviteResponse', (payload: InviteSocketMessageDto) => { inviteResponseHandler(payload, currentUser, currentChatRoom, chatMessagesFetcher, friendInviteFetcher, newChatRoom, setNewChatRoom, switchToChannelCounter, setSwitchToChannelCounter) });
		}
	}, [currentChatRoom])


	useEffect(() => { // UseEffect is used to handle the FRIEND invite response from the invitee.
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
		console.log("Chat")
		// if (firstRender.current) // This is to ensure that the chat is only created once.
		// {
		// firstRender.current = false;
		if (user2 && user2 !== -1) // If we have a user2, we need to create a DM chat.
		{
			setOtherUserForDm(user2);
			fetchDM(chatFetcher, currentUser.id, user2) // This will set the chatID.
		}
		else if (chatId && chatId !== -1) // If we have a chatid, we need to fetch the chat messages for it
		{
			fetchChat(chatFetcher, chatId, currentUser.id);
		}
		chatSocket.on('chat/messageFromRoom', handleMessageFromRoom);
		chatSocket.on('invite/inviteResponse', (payload: InviteSocketMessageDto) => { inviteResponseHandler(payload, currentUser, currentChatRoom, chatMessagesFetcher, friendInviteFetcher, newChatRoom, setNewChatRoom, switchToChannelCounter, setSwitchToChannelCounter) });
		chatSocket.on('chat/patch', (payload: FetchChatDto) => {
			console.log("Chat patched (socket): ", payload);
			console.log("Id (socket)", payload.id);
			if (payload.action == "patch")
				fetchChat(chatFetcher, payload.id, currentUser.id);
			else if (payload.action == "delete_user") {
				console.log("User was deleted from the chat room", payload);
				if (payload.users.find(user => user.userId == currentUser.id) != undefined) {
					console.log("Someone else was deleted from the chat room");
					setCurrentChatRoom(payload);
					// fetchChat(chatFetcher, payload.id, currentUser.id);
				}
			}

		});
		// }
		return () => {
			chatSocket.off('chat/messageFromRoom');
			chatSocket.off('invite/inviteResponse')
			chatSocket.off('chat/patch');
			setCurrentChatRoom({ id: -1, name: '', visibility: ChatType.PUBLIC, users: [], ownerId: 0 });
		};
	}, [chatId, user2, chatAuth]);

	// This effect is used to update the chat when a user changes their status.
	useEffect(() => {
		if (someUserUpdatedTheirStatus && someUserUpdatedTheirStatus.userId == otherUserForDm) {
			const statusMessage = <>{'<<'} {someUserUpdatedTheirStatus.userName} {(someUserUpdatedTheirStatus.status == OnlineStatus.ONLINE ? 'is online' : 'went offline')}  {'>>'}</>
			setChat(prevChat => [...prevChat, statusMessage]);
		}
	}, [someUserUpdatedTheirStatus]);

	// This effect is used to join the room when the chatId changes.
	useEffect(() => {
		console.log("Chat from db: ", chatFromDb);
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

	// This effect is used to leave the room when the chatId or user2 changes.
	useEffect(() => {
		console.log("User2/chatId changed: ", user2, chatId, chatFromDb);
		// if (chatFromDb?.id)
		leaveRoom(currentUser.id, currentChatRoom, currentUser, setCurrentChatRoom);
		// if (!firstRender.current)
		// 	firstRender.current = true;
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
				return null;
			}
			).filter((parsedMessage) => parsedMessage != null));
		}
	}, [chatMessages])

	const showPassWordWrongMsg = (error: any) : Boolean => {
		if (!error)
			return false;
		const prefix = "401 - Incorrect password for chat :";
		const startIdx = error.message.indexOf(prefix) + prefix.length;
		const chatIdString = error.message.slice(startIdx);
		const chatId = parseInt(chatIdString);
		return newChatRoom.room == chatId;
	}

	return (
		<>
			<div className="white-box chat-box">
				{chatLoading && <>Chat is loading</>}
				{chatError &&
					(chatError.message == "401 - Unauthorized access to chat" ?
						<>
							<FontBangers>
								<h4>Protected channel</h4>
							</FontBangers>
							<form method="POST" className="row" onSubmit={(e) => {
								e.preventDefault();
								chatAuthFetcher({ url: constants.API_AUTH_CHAT, fetchMethod: 'POST', payload: { chatId: (chatId? chatId: -1), pwd: e.currentTarget.password.value } });
							}}>
								<div className="col col-4">
									<p>Password:</p>
								</div>
								<div className="col col-5">
									<input className="form-control form-control-sm" type="password" name="password" />
								</div>
								<div className="col col-3">
									<button className="btn btn-dark btn-sm" type="submit">Enter</button>
								</div>
							</form>
							{showPassWordWrongMsg(chatAuthError) && <>The password you entered is incorrect.</>}
						</>
					: 
						(chatError.message == "401 - User is banned from chat" ?
							<FontBangers>You are banned from this chat.</FontBangers>
						:
							<FontBangers>Error loading chat <br />{chatError.message}</FontBangers>
						)
					)
				}
				{chatFromDb && <>
					<div className="chat-title">
						{
							chatFromDb ?
								(chatFromDb.visibility == ChatType.DM ?
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
									</>) : <></>
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
						<form className="row justify-content-end" onSubmit={(e) => {
							e.preventDefault();
							sendMessage(currentUser.id, otherUserForDm ? otherUserForDm : 0, chatFromDb, currentUser, message, chatSocket, setMessage, newMessageFetcher);
						}}>
							<div className="col">
								<input className="form-control form-control-sm"
								type='text'
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								/>	
							</div>
							<div className="col col-auto">
								<button className="btn btn-dark btn-sm" type='submit' disabled={message.length > 0 ? false : true}>Send</button>
							</div>
						</form>
					</div>
				</>}
			</div>
		</>
	);
}
