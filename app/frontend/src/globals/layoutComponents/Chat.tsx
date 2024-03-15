"use client"
import { useContext, useEffect, useRef, useState } from 'react';
import { FetchChatMessageDto, ChatMessageToRoomDto, CreateChatSocketDto, FetchChatDto } from '@dto/chat';
import { UserProfileDto } from '@dto/users';
import { constants} from '@global/constants.globalvar';
import { TranscendenceContext } from '@global/contextprovider.globalvar';
import { transcendenceSocket } from '@global/socket.globalvar';
import { ChatType, OnlineStatus } from '@prisma/client';
import DataFetcherJson from '@global/functionComponents/DataFetcherJson';
import DataFetcherMarkup from '@global/functionComponents/DataFetcherMarkup';



const chatSocket = transcendenceSocket;

/**
 * 
 * @param param0 user1: user1 id (the current user, might update this later), user2: user2 id, chatID: chat id
 * @returns JSX.Element
 */
export default function Chat({ user1, user2, chatID }: { user1?: number, user2?: number, chatID?: number }) {
	const [message, setMessage] = useState('');
	const [chat, setChat] = useState<string[]>([]);
	const [currentChat, setCurrentChat] = useState<FetchChatDto>({ id: 0, ownerId: 0, visibility: ChatType.DM });
	const firstRender = useRef(true);
	const firstMessage = useRef(true);
	const { currentUser, someUserUpdatedTheirStatus, currentChatRoom, setCurrentChatRoom } = useContext(TranscendenceContext);
	const messageBox = useRef<HTMLDivElement>(null);

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
		if (currentChat.id) {
			joinRoom();
			fetchMessages();
		}

	}, [currentChat])

	// This effect is used to leave the room and reset the chat when the user2 changes.
	useEffect(() => {
		if (currentChat.id)
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
		const response = await fetch(constants.CHAT_CREATE_DM, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});
		const data = await response.json();
		setCurrentChat(data);
	}

	// This function is used to fetch the messages for the current chat.
	const fetchMessages = async () => {
		console.log('Fetching messages for chat', currentChat.id);
		const data: FetchChatMessageDto[] = await DataFetcherJson({ url: constants.CHAT_GET_MESSAGES_FROM_CHAT + currentChat.id });
		if (data instanceof Error) {
			console.log('Error fetching messages:', data);
			setChat(['Error fetching messages, please try again later.']);
			return;
		}
		const mappedData = data.map((message: FetchChatMessageDto) => `${message.userName}: ${message.message}`);
		setChat(mappedData);
	}

	// This function is used to join the room.
	const joinRoom = () => {
		if (currentChatRoom == currentChat.id) { //To avoid double joins, especially in strict mode. 
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
			if (firstMessage.current) { //This is to avoid the first message being `<< user has joined the chat >>
				firstMessage.current = false;
				return;
			}else{
				handleMessageFromRoom(payload);
			}
		});
	}
	
	// This function is used to leave the room.
	const leaveRoom = () => {
		if (!currentChat.id)
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
		firstMessage.current = true;
	}

	// This function is used to handle messages from the room.
	const handleMessageFromRoom = (payload: ChatMessageToRoomDto) => {
		if (payload.action) {
			setChat(prevChat => [...prevChat, payload.message]);
		} else {
			setChat(prevChat => [...prevChat, `${payload.userName}: ${payload.message}`]);
		}
	}

	// This function is used to send a message.
	const sendMessage = () => {
		if (!user1 || !user2)
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
			<div className='component chatBox'>
				{
					currentChat.visibility == ChatType.DM ?
						<div>Chat between {currentUser.userName} and
							<DataFetcherMarkup<UserProfileDto>
								url={constants.API_SINGLE_USER + user2}
								renderData={(data) => (
									<span> {data.userName}</span>
								)} /></div>
						: <></>
				}
				<div className='chatMessages' ref={messageBox}>
					{chat.map((message, index) => (
						<p key={index}>{message}</p>
					))}
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
		</>
	);
}