"use client"
import { useContext, useEffect, useRef, useState } from 'react';
import { FetchChatMessageDto, ChatMessageToRoomDto, CreateChatSocketDto, UpdateChatDto } from '@ft_dto/chat';
import { UserProfileDto } from '@ft_dto/users';
import { constants} from '@ft_global/constants.globalvar';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { transcendenceSocket } from '@ft_global/socket.globalvar';
import { ChatType, OnlineStatus } from '@prisma/client';
import useFetch from '@ft_global/functionComponents/useFetch';
import DataFetcher from '@ft_global/functionComponents/DataFetcher';
import { FontBangers } from '../Font';
import { sendMessage, joinRoom, leaveRoom } from './chatSocketFunctions';
import { fetchMessages, fetchChat } from './chatFetchFunctions';
import { messageParser } from './chatMessageParser';

const chatSocket = transcendenceSocket;

export default function Chat({ user2: otherUserForDm, chatID: chatId }: { user2?: number, chatID?: number }) {
	const [message, setMessage] = useState('');
	const [chat, setChat] = useState<string[]>([]);
	const firstRender = useRef(true);
	const { currentUser, someUserUpdatedTheirStatus, currentChatRoom, setCurrentChatRoom } = useContext(TranscendenceContext);
	const messageBox = useRef<HTMLDivElement>(null);
	const { data: currentChat, isLoading: chatLoading, error: chatError, fetcher: chatFetcher } = useFetch<CreateChatSocketDto, UpdateChatDto>();
	const { data: chatMessages, isLoading: chatMessagesLoading, error: chatMessagesError, fetcher: chatMessagesFetcher } = useFetch<null, FetchChatMessageDto[]>();

	// This effect is used to set up the chat and join the room when the component is rendered.
	useEffect(() => {
		// If we don't have a user2 or a chatID, we can't create a chat.
		if (!otherUserForDm && !chatId) {
			return;
		}

		if (firstRender.current) // This is to ensure that the chat is only created once.
		{
			firstRender.current = false;
			if (!chatId) // If we don't have a chatID, we need to create a chat.
				fetchChat(chatFetcher, currentUser.id, otherUserForDm) // This will set the chatID.
			else // If we have a chatID, we need to join the chat.
				joinRoom(currentUser.id, { id: chatId }, currentUser, currentChatRoom, setCurrentChatRoom, handleMessageFromRoom);
		}
		return () => {
			chatSocket.off('chat/messageFromRoom');
			setCurrentChatRoom(-1);
		};
	}, [otherUserForDm, firstRender.current]);

	// This effect is used to update the chat when a user changes their status.
	useEffect(() => {
		if (someUserUpdatedTheirStatus && someUserUpdatedTheirStatus.userId == otherUserForDm) {
			const statusMessage = "<<" + someUserUpdatedTheirStatus.userName + " " + (someUserUpdatedTheirStatus.status == OnlineStatus.ONLINE ? 'is online' : 'went offline') + ">>";
			setChat(prevChat => [...prevChat, statusMessage]);
		}
	}, [someUserUpdatedTheirStatus]);

	// This effect is used to join the room when the chatId changes.
	useEffect(() => {
		if (!currentChat)
			return;
		if (currentChat.id) {
			joinRoom(currentUser.id, currentChat, currentUser, currentChatRoom, setCurrentChatRoom, handleMessageFromRoom);
			fetchMessages(currentChat, chatMessagesFetcher);
		}

	}, [currentChat])

	// This effect is used to leave the room and reset the chat when the user2 changes.
	useEffect(() => {
		if (currentChat?.id)
			leaveRoom(currentUser.id, currentChat, currentUser);
		if (!firstRender.current)
			firstRender.current = true;
	}, [otherUserForDm]);

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
		setChat(chatMessages.map((message: FetchChatMessageDto) => `${message.userName}: ${message.message}`));
	},[chatMessages])

	const handleMessageFromRoom = (payload: ChatMessageToRoomDto) => {
		const message = messageParser(payload, currentUser.id);
		if (message)
			setChat(prevChat => [...prevChat, message]);
	}

	return (
		<>
			<div className="white-box">
				{chatLoading && <>Chat is loading</>}
				{chatError && <>Error loading chat</>}
				{currentChat && <>
					<div className="chat-title">
					{
						currentChat?.visibility == ChatType.DM ?
						<FontBangers>
							<h3>Chat between {currentUser.userName} and&nbsp;
								<DataFetcher<UserProfileDto, UserProfileDto>
									url={constants.API_USERS + otherUserForDm}
									showData={(data: UserProfileDto) => <>{data.userName}</>}
									showLoading={<></>}
								/>
							</h3>
						</FontBangers>
						: <></>
					}
					</div>
					<div className="chat-messages" ref={messageBox}>
						{chatMessagesLoading && <>Chat messages are loading</>}
						{chatMessagesError && <>Error loading chat messages</>}
						{chatMessages? chat.map((message, index) => (
							<p key={index}>{message}</p>
						)):<></>}
					</div>
					<div className="chat-input">
						<form onSubmit={(e) => {
							e.preventDefault();
							sendMessage(currentUser.id, otherUserForDm ? otherUserForDm : 0, currentChat, currentUser, message, chatSocket, setMessage);
						}}>
							<input
								type='text'
								value={message}
								onChange={(e) => setMessage(e.target.value)}
							/>
							<button type='submit'>send</button>
						</form>
					</div>
				</>}
			</div>
		</>
	);
}
