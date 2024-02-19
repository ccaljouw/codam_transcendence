"use client"
import { useEffect, useState } from 'react';
import UserList from 'src/components/UserList';
import { UserProfileDto } from '../../../../backend/src/users/dto/user-profile.dto'
import Chat from '../../components/Chat'
// import {setCurrentUserDisplayFunc,} from '../../globals/userdisplay.globalfunctions'

export default function Page() {
	const [secondUser, setSecondUser] = useState(0);
	const [currentUser, setCurrentUser] = useState(0);
	const [filterUserIds, setFilterUserIds] = useState<number[]>([]);
	useEffect(() => {
		console.log(`userId ${sessionStorage.getItem('userId')}`)
		const sessionUserId = sessionStorage.getItem('userId');
		if (sessionUserId && sessionUserId != '')
			setCurrentUser(parseInt(sessionUserId))
	})

	function setCurrentUserDisplayFunc(user: UserProfileDto) {
		return (
			<li key={user.id} onClick={() => { sessionStorage.setItem('userId', user.id.toString()); setCurrentUser(user.id); setFilterUserIds([user.id]); console.log(`User set to ${user.id}`) }}>
				{user.firstName} {user.lastName} - {user.email}
			</li>
		)
	}

	function selectSecondUserDisplayFunc(user: UserProfileDto) {
		return (
			<li key={user.id} onClick={() => {  setSecondUser(user.id); console.log(`Second user set to ${user.id}`) }}>
				{user.firstName} {user.lastName} - {user.email}
			</li>
		)
	}

	if (!currentUser) {
		return (
			<>
			<h3>Who are you?</h3>
			<UserList userDisplayFunction={setCurrentUserDisplayFunc} />
			</>
		)
	}
	if (currentUser && !secondUser)
		return (
			<>
			<h3>Hello {currentUser}, Who do you wanna chat with?</h3>
			<UserList userDisplayFunction={selectSecondUserDisplayFunc} filterUserIds={[currentUser]} />
			</>
		)
	if (currentUser && secondUser)
	{return (
		<Chat user1={currentUser} user2={secondUser}/>
	)}
	// return (
	// 	<>
	// 		<div className="component">
	// 			<br />
	// 			<h1>Websocket test space</h1>
	// 		</div>
	// 		{/* <UserList userDisplayFunction={setCurrentUserDisplayFunc} filterUserIds={[1, 2, 3]} includeFilteredUserIds /> */}
	// 		{/* <UserList userDisplayFunction={setCurrentUserDisplayFunc} /> */}
	// 		{
	// 			!currentUser ?
	// 				(
	// 				<>
	// 					<h4>Who are you?</h4>
	// 					<UserList userDisplayFunction={setCurrentUserDisplayFunc}/>
	// 				</>
	// 				) : (
	// 					!secondUser ?
	// 						(
	// 						<>
	// 						<h4>Who do you want to chat with?</h4>
	// 						<UserList userDisplayFunction={setCurrentUserDisplayFunc} filterUserIds={[1]}/>
	// 						</>
	// 						):(
	// 						<>
	// 						<h4>Nothing</h4>
	// 						</>
	// 						)
	// 				)
	// 		}

	// 	</>
	// );
}
