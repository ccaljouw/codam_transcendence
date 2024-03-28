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



const chatSocket = transcendenceSocket;

/**
 * 
 * @param param0 user1: user1 id (the current user, might update this later), user2: user2 id, chatID: chat id
 * @returns JSX.Element
 */
export default function Chat({ user1, user2, chatID }: { user1?: number, user2?: number, chatID?: number }) {
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
		if (!user2 && !chatID) {
			return;
		}

		if (firstRender.current) // This is to ensure that the chat is only created once.
		{
			firstRender.current = false;
			if (!chatID) // If we don't have a chatID, we need to create a chat.
				fetchChat(); // This will set the chatID.
			else // If we have a chatID, we need to join the chat.
				joinRoom();
		}
		return () => {
			chatSocket.off('chat/messageFromRoom');
			setCurrentChatRoom(-1);
		};
	}, [user2, firstRender.current]);

	// This effect is used to update the chat when a user changes their status.
	useEffect(() => {
		if (someUserUpdatedTheirStatus && someUserUpdatedTheirStatus.userId == user2) {
			const statusMessage = "<<" + someUserUpdatedTheirStatus.userName + " " + (someUserUpdatedTheirStatus.status == OnlineStatus.ONLINE ? 'is online' : 'went offline') + ">>";
			setChat(prevChat => [...prevChat, statusMessage]);
		}
	}, [someUserUpdatedTheirStatus]);

	// This effect is used to join the room when the chatId changes.
	useEffect(() => {
		if (!currentChat)
			return;
		if (currentChat.id) {
			joinRoom();
			fetchMessages();
		}

	}, [currentChat])

	// This effect is used to leave the room and reset the chat when the user2 changes.
	useEffect(() => {
		if (currentChat?.id)
			leaveRoom();
		if (!firstRender.current)
			firstRender.current = true;
	}, [user2]);

	// This effect is used to scroll to the bottom of the chat when the chat changes.
	useEffect(() => {
		if (messageBox.current) {
			const { scrollHeight, clientHeight } = messageBox.current;
			messageBox.current.scrollTop = scrollHeight - clientHeight;
		}
	}, [chat])

	// This function is used to create a chat between two users.
	const fetchChat = async () => {
		if (!user1 || !user2)
			return;
		const payload: CreateChatSocketDto = { user1Id: user1, user2Id: user2 };
		await chatFetcher({ url: constants.CHAT_CREATE_DM, fetchMethod: "POST", payload })
	}

	useEffect(() => {
		if (!chatMessages)
			return;
		setChat(chatMessages.map((message: FetchChatMessageDto) => `${message.userName}: ${message.message}`));
	},[chatMessages])

	// This function is used to fetch the messages for the current chat.
	const fetchMessages = async () => {
		if (!currentChat)
			return;
		await chatMessagesFetcher({ url: constants.CHAT_GET_MESSAGES_FROM_CHAT + currentChat.id });
	}

	// This function is used to join the room.
	const joinRoom = () => {
		if (currentChatRoom == currentChat?.id || !currentChat) { //To avoid double joins, especially in strict mode. 
			return;
		}
		const statusChangeMsg: ChatMessageToRoomDto = {
			userId: (user1 ? user1 : 0),
			userName: currentUser.userName,
			room: currentChat.id.toString(),
			message: `<< ${currentUser.userName} has joined the chat >>`,
			action: true
		};
		chatSocket.emit('chat/joinRoom', statusChangeMsg);
		setCurrentChatRoom(currentChat.id);
		chatSocket.on('chat/messageFromRoom', (payload: ChatMessageToRoomDto) => {
				handleMessageFromRoom(payload);
		});
	}

	// This function is used to leave the room.
	const leaveRoom = () => {
		if (!currentChat?.id)
			return;
		const leaveMessage: ChatMessageToRoomDto = {
			userId: (user1 ? user1 : 0),
			userName: currentUser.userName,
			room: currentChat.id.toString(),
			message: `<< ${currentUser.userName} has left the chat >>`,
			action: true
		};
		chatSocket.emit('chat/leaveRoom', leaveMessage);
		chatSocket.off('chat/messageFromRoom');
	}

	// This function is used to handle messages from the room.
	const handleMessageFromRoom = (payload: ChatMessageToRoomDto) => {
		if (payload.action) {
			console.log(`Received action message: ${payload.message} ${payload.userId} ${payload.userName} ${payload.room}`);
			if (payload.message == "JOIN" && payload.userId == user1) // If the user is the current user, we don't want to show the message.	
					return ;
			switch (payload.message) {
				case "JOIN":
					setChat(prevChat => [...prevChat, `<< ${payload.userName} has joined the chat >>`]);
					break;
				case "LEAVE":
					setChat(prevChat => [...prevChat, `<< ${payload.userName} has left the chat >>`]);
					break;
			}
		} else {
			setChat(prevChat => [...prevChat, `${payload.userName}: ${payload.message}`]);
		}
	}

	// This function is used to send a message.
	const sendMessage = () => {
		if (!user1 || !user2 || !currentChat)
			return;
		const payload: ChatMessageToRoomDto = {
			userId: user1,
			userName: currentUser.userName,
			room: currentChat.id.toString(),
			message: message, action: false
		};
		chatSocket.emit("chat/msgToRoom", payload);
		console.log(`sending [${message}] to room ${currentChat.id}]`)
		setMessage('');
	};

	return (
		<>
			{chatLoading && <>Chat is loading</>}
			{chatError && <>Error loading chat</>}
			{currentChat && <div className='component chatBox'>
				{
					currentChat?.visibility == ChatType.DM ?
						<div>Chat between {currentUser.userName} and
						<DataFetcher<UserProfileDto, UserProfileDto>
							url={constants.API_USERS + user2}
							showData={(data: UserProfileDto) => <>{data.userName}</>}
							showLoading={<></>}
						/>
						</div>
						: <></>
				}
				<div className='chatMessages' ref={messageBox}>
					{chatMessagesLoading && <>Chat messages are loading</>}
					{chatMessagesError && <>Error loading chat messages</>}
					{chatMessages? chat.map((message, index) => (
						<p key={index}>{message}</p>
					)):<></>}
				</div>
				<div className='chatInput'>
					<form onSubmit={(e) => {
						e.preventDefault();
						sendMessage();
					}}>
						<input
							type='text'
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
						<button type='submit'>send</button>
					</form>
				</div>
				<style jsx>{`
				.chatBox{
					width: 400px;
					height: 350px;
				}
                .chatMessages {
                    height: 200px;
					width: 200px;
                    overflow-y: scroll;
                }
				.chatMessages p{
					color: blue;
					margin-bottom: -2pt;
				}
            `}</style>
			</div>}
		</>

	);
}