"use client"
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client'

const socket = io('http://localhost:3001', {autoConnect: false});

export default function Chat({user1, user2}: {user1: number, user2:number}) {
	const [message, setMessage] = useState('');
	const [chat, setChat] = useState<string[]>([]);
	// const [receivedMessage, setReceivedMessage] = useState('');
	const [gameId, setGameId] = useState('');
	const firstRender = useRef(true);

	useEffect(() => {
		socket.connect();
		console.log("useffect called");
		const userData = {
			user1_id: user1,
			user2_id: user2
		}
		socket.on('message', (msg:string) => {
			console.log('got message');
			setChat(prevChat => [...prevChat, msg]);
			// setReceivedMessage(msg);
		});

		if (firstRender.current)
		{
			socket.emit('createGame', userData);
			fetchGameId();
			firstRender.current = false;
		}
		return () => {
			socket.off('message');
			socket.disconnect();
		};
		// setGameCreated(true);
	},[]);

	const fetchGameId = async () => {
		try {
			const data = await waitForSocketEvent(socket, 'newGame');
			const parseData = data as string;
			setGameId(parseData);
			socket.off('newGame');
			console.log('Socket event received:', data);
			
		  } catch (error) {
			console.error('Error while waiting for socket event:', error);
		  }
	}
	useEffect(() => {
		if(gameId == '')
			return ;
		console.log(`New game: ${gameId}`);
		return () => {
			socket.emit('removeGame', parseInt(gameId));
			console.log(`removing game [${gameId}]`);
		};
	}, [gameId]);

	const waitForSocketEvent = (socket: any, eventName: string) => {
		return new Promise((resolve, reject) => {
		  socket.on(eventName, (data: any) => {
			resolve(data);
		  });
	  
		});
	  };


	const sendMessage = () => {
		socket.emit('message', message);
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
