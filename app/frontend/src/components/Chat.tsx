"use client"
import { useEffect, useRef, useState } from 'react';
import {transcendenceSocket} from '../globals/socket.globalvar'


const chatSocket = transcendenceSocket;

export default function Chat({user1, user2}: {user1: number, user2:number}) {
	const [message, setMessage] = useState('');
	const [chat, setChat] = useState<string[]>([]);
	const [chatId, setChatId] = useState('');
	const firstRender = useRef(true);

	useEffect(() => {
		chatSocket.connect()
		console.log("useffect called");
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
			console.log(`returning useffect ${chatId}`);
			chatSocket.off('chat/message');
		};
	},[]);

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
		chatSocket.emit('chat/message', message);
		setMessage('');
	};

	return (
		<div className="component">
		{chat.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
			<input
				type='text'
				value={message}
				onChange={(e) => setMessage(e.target.value)}
			/>
			<button onClick={sendMessage}>send</button>
			</div>
	);
}
