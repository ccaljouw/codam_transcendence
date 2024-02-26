"use client"
import { useContext, useEffect, useRef, useState } from 'react';
import {transcendenceSocket} from '../../globals/socket.globalvar'
import { TranscendenceContext } from 'src/globals/contextprovider.globalvar';


const chatSocket = transcendenceSocket;

export default function Chat({user1, user2}: {user1: number, user2:number}) {
	const [message, setMessage] = useState('');
	const [chat, setChat] = useState<string[]>([]);
	const [chatId, setChatId] = useState('');
	const firstRender = useRef(true);
	const {currentUserName} = useContext(TranscendenceContext);
	const bottomOfChat = useRef<HTMLDivElement>(null);
	const messageBox = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const userData = {
			user1_id: user1,
			user2_id: user2
		}
		chatSocket.on('chat/message', (msg:string) => {
			console.log('got message');
			setChat(prevChat => [...prevChat, msg]);
		});

		if (firstRender.current)
		{
			chatSocket.emit('chat/create', userData);
			fetchGameId();
			firstRender.current = false;
		}
		return () => {
			chatSocket.off('chat/message');
		};
	},[]);

	useEffect(() => {
		if (messageBox.current)
		{
			const {scrollHeight, clientHeight} = messageBox.current;
			messageBox.current.scrollTop = scrollHeight - clientHeight;
		}
	}, [chat])

	const fetchGameId = async () => {
		try {
			const data = await waitForSocketEvent(chatSocket, 'chat/create');
			const parseData = data as string;
			console.log('Socket event received:', data);
			setChatId(parseData);
			chatSocket.off('chat/create');
		  } catch (error) {
			console.error('Error while waiting for socket event:', error);
		  }
	}

	const waitForSocketEvent = (socket: any, eventName: string) => {
		return new Promise((resolve, reject) => {
		  chatSocket.on(eventName, (data: any) => {
			resolve(data);
		  });
	  
		});
	  };

	const sendMessage = () => {
		chatSocket.emit('chat/message', `${currentUserName}: ${message}`);
		setMessage('');
	};



	return (
		<>
		<div className='component chatBox'>
		<div className='chatMessages' ref={messageBox}>
			{chat.map((message, index) => (
			<p key={index}>{message}</p>
			))}
			<div ref={bottomOfChat} />
		</div>
		<div className='chatInput'>
			<form onSubmit={(e) =>
			{e.preventDefault();
			sendMessage();}}>
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
