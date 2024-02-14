"use client"
import { useEffect } from 'react';
import UserList from 'src/components/UserList';


function SocketTest()
{
	useEffect(() => {
		console.log("sockettest useeffect");
		// console.log()
	},[]);

	return (
		// <>
		<div>
			<UserList />
		</div>
	
	);
}

export default function Page() {
	return (
		<>
			<div className="websocketTest">
				<br />
				<h1>Websocket test space</h1>
					<SocketTest />
			</div>
		</>
	);
}
