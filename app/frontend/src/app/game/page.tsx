"use client"
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

const socket = io('http://localhost:3001', {autoConnect: true});

function SocketTest()
{
	const [message, setMessage] = useState('');
	const [receivedMessage, setReceivedMessage] = useState('');

	useEffect(() => {
		// socket.connect();
		console.log('using effect');
		socket.on('message', (msg) => {
				console.log('got message');
				setReceivedMessage(msg);
		});
		return () => {
		socket.off('message');
		// socket.disconnect();
		};
	}
	);

	const sendMessage = () => {
		socket.emit('message', message);
		socket.emit('createGame');
		setMessage('');
	};
	return (
		// <>
		<div>
			<p>Received Message: {receivedMessage}</p>
			<input
				type='text'
				value={message}
				onChange={(e) => setMessage(e.target.value)}
			/>
			<button onClick={sendMessage}>send</button>
		</div>
		// </>
	);
}

// function MenuItem({href, title}:{href:string, title:string}){
// 	const pathname = usePathname();
// 	const menuClass = pathname === href ? styles.menuItemActive : styles.menuItemInactive;
// 	return (
// 		<Link className={menuClass} href={href}>{title}</Link>
// 	);
// }

export default function Page() {
	return (
		<>
			<div className="websocketTest">
				<br />
				<h1>Websocket test space</h1>
				{/* <p>Here you can create an acount. You can not chat, because you are not logged in yet</p> */}
				{/* <SignUp /> */}
				<div className="component">
					<p>This is where we test websockets</p>
					<SocketTest></SocketTest>
				
					<br></br>
					<br></br>
					<br></br>
					<br></br>
					<br></br>
					<br></br>
					<br></br>
					<br></br>
					<br></br>
				</div>
			</div>
		</>
	);
}
