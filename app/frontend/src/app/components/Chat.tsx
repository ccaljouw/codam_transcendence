"use client"
import { useContext, useEffect, useRef, useState } from 'react';
import { transcendenceSocket } from '../../globals/socket.globalvar'
import { TranscendenceContext } from 'src/globals/contextprovider.globalvar';
import { FetchChatMessageDto } from '../../../../backend/src/chat/dto/fetch-chatMessage.dto';
import { constants } from 'src/globals/constants.globalvar';
import { ChatMessageToRoomDto } from '../../../../backend/src/chat/dto/chat-messageToRoom.dto'
import { CreateChatSocketDto } from '../../../../backend/src/chat/dto/create-chatSocket.dto';
import { ChatType, OnlineStatus } from '@prisma/client';
import DataFetcherJson from 'src/components/DataFetcherJson';
import { FetchChatDto } from '../../../../backend/src/chat/dto/fetch-chat.dto';
import DataFetcherMarkup from 'src/components/DataFetcherMarkup';
import { UserProfileDto } from '../../../../backend/src/users/dto/user-profile.dto';



const chatSocket = transcendenceSocket;

export default function Chat({ user1, user2, chatID }: { user1?: number, user2?: number, chatID?: number }) {
	const [message, setMessage] = useState('');
	const [chat, setChat] = useState<string[]>([]);
	const [currentChat, setCurrentChat] = useState<FetchChatDto>({ id: 0, ownerId: 0, visibility: ChatType.DM });
	const [currentRoom, setCurrentRoom] = useState<number>(0);
	const firstRender = useRef(true);
	const { currentUserName, someUserUpdatedTheirStatus } = useContext(TranscendenceContext);
	const messageBox = useRef<HTMLDivElement>(null);

	// This effect is used to set up the chat and join the room when the component is rendered.
	useEffect(() => {
		console.log(`Chat component rendered ${chatID}`);
		if (!user2 && !chatID) {
			console.log('No user2 or chatID');
			return;
		}
		chatSocket.on('chat/messageFromRoom', (payload: ChatMessageToRoomDto) => {
			if (payload.action) {
				setChat(prevChat => [...prevChat, payload.message]);
			} else {
				setChat(prevChat => [...prevChat, `${payload.username}: ${payload.message}`]);
			}
		});

		if (firstRender.current) // This is to ensure that the chat is only created once.
		{
			console.log('Im gonna make a chat');
			firstRender.current = false;
			if (!chatID) // If we don't have a chatID, we need to create a chat.
			{
				console.log(`I gonna create a chat for ${user1} and ${user2}`);
				// chatSocket.emit('chat/createDM', { user1_id: user1, user2_id: user2 });
				fetchChat();

			} else { // If we have a chatID, we need to join the chat.
				console.log('I have a chatID', chatID);
				joinRoom();
			}
		}
		return () => {
			console.log('Chat unmounted');
			chatSocket.off('chat/messageFromRoom');
		};
	}, [user2, firstRender.current]);



	// This effect is used to update the chat when a user changes their status.
	useEffect(() => {
		console.log(`someUserUpdatedTheirStatus changed: ${someUserUpdatedTheirStatus ? someUserUpdatedTheirStatus.username : ''} ${someUserUpdatedTheirStatus ? someUserUpdatedTheirStatus.status : ''}`);
		if (someUserUpdatedTheirStatus && someUserUpdatedTheirStatus.userid == user2) {
			const statusMessage = "<<" + someUserUpdatedTheirStatus.username + " " + (someUserUpdatedTheirStatus.status == OnlineStatus.ONLINE ? 'is online' : 'went offline') + ">>";
			setChat(prevChat => [...prevChat, statusMessage]);
		}
	}, [someUserUpdatedTheirStatus]);

	// This effect is used to join the room when the chatId changes.
	useEffect(() => {
		console.log('chatId changed to', currentChat.id);
		if (currentChat.id) {
			joinRoom();
			fetchMessages();
		}

	}, [currentChat])

	// This effect is used to leave the room and reset the chat when the user2 changes.
	useEffect(() => {
		console.log('user2 changed to ', user2);
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
		const payload: CreateChatSocketDto = { user1_id: user1, user2_id: user2 };
		const response = await fetch(constants.BACKEND_ADRESS_FOR_WEBSOCKET + `chat-messages/createDM`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});
		const data = await response.json();
		console.log('My chat is', data.id);
		setCurrentChat(data);
	}

	// This function is used to fetch the messages for the current chat.
	const fetchMessages = async () => {
		console.log('Fetching messages for chat', currentChat.id);
		const data: FetchChatMessageDto[] = await DataFetcherJson({ url: constants.BACKEND_ADRESS_FOR_WEBSOCKET + `chat-messages/${currentChat.id}` });
		if (data instanceof Error) {
			console.log('Error fetching messages:', data);
			setChat(['Error fetching messages, please try again later.']);
			return;
		}
		const mappedData = data.map((message: FetchChatMessageDto) => `${message.loginName}: ${message.message}`);
		setChat(mappedData);
	}

	// This function is used to join the room.
	const joinRoom = () => {
		if (currentRoom == currentChat.id) {
			console.log('I am already in room', currentChat.id);
			return;
		}
		console.log('I should join room', currentChat.id);
		const statusChangeMsg: ChatMessageToRoomDto = {
			userid: (user1 ? user1 : 0),
			username: currentUserName,
			room: currentChat.id.toString(),
			message: `<< ${currentUserName} has joined the chat >>`,
			action: true
		};
		chatSocket.emit('chat/joinRoom', statusChangeMsg);
		setCurrentRoom(currentChat.id);
	}

	// This function is used to leave the room.
	const leaveRoom = () => {
		if (!currentChat.id)
			return;
		console.log('I should leave room', currentChat.id);
		const leaveMessage: ChatMessageToRoomDto = { userid: (user1 ? user1 : 0), username: currentUserName, room: currentChat.id.toString(), message: `<< ${currentUserName} has left the chat >>`, action: true };
		chatSocket.emit('chat/leaveRoom', leaveMessage);
	}

	// This function is used to send a message.
	const sendMessage = () => {
		if (!user1 || !user2)
			return;
		const payload: ChatMessageToRoomDto = { userid: user1, username: currentUserName, room: currentChat.id.toString(), message: message, action: false };
		chatSocket.emit("chat/msgToRoom", payload);
		console.log(`sending [${message}] to room ${currentChat.id}]`)
		setMessage('');
	};

	return (
		<>
			<div className='component chatBox'>
				{
					currentChat.visibility == ChatType.DM ?
						<div>Chat between {currentUserName} and
							<DataFetcherMarkup<UserProfileDto>
								url={constants.BACKEND_ADRESS_FOR_WEBSOCKET + `users/${user2}`}
								renderData={(data) => (
									<span> {data.loginName}</span>
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
