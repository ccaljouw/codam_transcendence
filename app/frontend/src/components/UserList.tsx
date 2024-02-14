// import

import { useEffect, useRef, useState } from "react"
import Chat from 'src/components/Chat';
// import styles from "../styles/component.css";

const UserList = () => {
	const [userListFromDb, setUserListFromDb] = useState([]);
	const [processedUserList, setProcessedUserList] = useState([]);
	const [currentUser, setCurrentUser] = useState('');
	const [otherUser, setOtherUser] = useState('');
	const [startChat, setStartChat] = useState(false);
	const firstRender = useRef(true);

	const handleUserClick = (id: string) => {
		if (!currentUser) {
			sessionStorage.setItem('userId', id);
			setCurrentUser(id);
			console.log(`User set to ${id}`);
			return ;
		}
		setOtherUser(id);
		setStartChat(true);
	}

	useEffect(() => {
		const fetchSessionId = sessionStorage.getItem('userId');
		if (fetchSessionId)
			{setCurrentUser(fetchSessionId);}

		if (firstRender.current)
		{
			firstRender.current = false;
			fetchUsers();
			// return ;
		}
			// else


	}, []);

	// useEffect(() =>{
	// 	console.log("Session storage changed");
	// }, [sessionStorage.getItem('userId')]);

	useEffect(() => {
		if (userListFromDb.length == 0)
			return ;
		console.log("db users:");
		console.log(userListFromDb);
		const filtered = userListFromDb.filter((user: { id: number }) => user.id.toString() !== currentUser)
		setProcessedUserList(filtered);
		console.log("processed");
		console.log(filtered);

	}, [userListFromDb, currentUser])

	async function fetchUsers() {
		console.log("fetching users");
		try {
			const response = await fetch('http://localhost:3001/users/all');
			if (!response.ok) {
				throw new Error('Failed to fetch users');
			}
			const data = await response.json();
			// console.log("data:");
			// console.log(data);
			setUserListFromDb(data);
		} catch (error) {
			console.error(error);
		}
	}
	
	if (!startChat)
	{
	return (
		// <>
		<div className='component userlist'>
			<h4>
			{currentUser ? ("Who you wanna chat with?") : ("Who are you?")}
			</h4>
			<ul>
				{
					processedUserList.map((user: { id: number, firstName: string, lastName: string, email: string }) =>
						<li key={user.id} onClick={() => handleUserClick(user.id.toString())}>
							{user.firstName} {user.lastName} - {user.email}
						</li>)
				}
			</ul>
		</div>
		// </>
	);}
	else
	{
		return (
			<Chat user1={parseInt(currentUser)} user2={parseInt(otherUser)}></Chat>
		);
	}
}


export default UserList;