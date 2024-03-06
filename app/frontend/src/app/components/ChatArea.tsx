"use client"
import { useContext, useEffect, useState } from 'react';
import UserList from 'src/components/UserList';
import { UserProfileDto } from '../../../../backend/src/users/dto/user-profile.dto'
import Chat from '../components/Chat'
import {transcendenceSocket, transcendenceConnect} from '../../globals/socket.globalvar'
import { OnlineStatus } from '@prisma/client';
import { TranscendenceContext } from 'src/globals/contextprovider.globalvar';

export default function  ChatArea() {
	const [secondUser, setSecondUser] = useState(0);
	const {currentUserId, setCurrentUserId, currentUserName, setCurrentUserName} = useContext(TranscendenceContext)
	
	useEffect(() => {
		console.log("chatarea rendered");
		console.log(`userId ${sessionStorage.getItem('userId')}`)
		if (typeof window !== 'undefined' && sessionStorage && sessionStorage.getItem != null) {
			const userIdFromSession = sessionStorage.getItem('userId');
			if (userIdFromSession && userIdFromSession != '')
				setCurrentUserId(parseInt(userIdFromSession));
		}


	},[currentUserId, secondUser])


	const setConnectionStatus = (user: UserProfileDto) => {
		console.log("I should do something with my connection status");
		sessionStorage.setItem('loginName', user.loginName); 
		sessionStorage.setItem('userId', user.id.toString());
		setCurrentUserId(user.id); 
		setCurrentUserName(user.loginName);
		console.log(`User set to ${user.id}`)
	}
	
	const test = "testttt";
	const setCurrentUserDisplayFunc = (user: UserProfileDto) => {
		return (
			<li key={user.id} onClick={() => { setConnectionStatus(user);   }}>
				{user.firstName} {user.lastName} - {user.email} - {user.id < 3 ? test : "nope"}
			</li>
		)
	}

	const selectSecondUserDisplayFunc = (user: UserProfileDto) => {
		return (
			<li key={user.id} onClick={() => {  setSecondUser(user.id); console.log(`Second user set to ${user.id}`) }}>
				{user.online == OnlineStatus.ONLINE ? ("[on]") : ("[off]")}
				{user.firstName} {user.lastName} - {user.email} - {user.id < 3 ? test : "nope"}
			</li>
		)
	}

	if (!currentUserId) {
		return (
			<>
			<h3>Who are you?</h3>
			<UserList userDisplayFunction={setCurrentUserDisplayFunc} />
			</>
		)
	}
	if (currentUserId && !secondUser)
		return (
			<>
			<h3>Hello {currentUserName}, Who do you wanna chat with?</h3>
			<UserList userDisplayFunction={selectSecondUserDisplayFunc} filterUserIds={[currentUserId]} />
			</>
		)
	if (currentUserId && secondUser)
	{return (
		<>
		<Chat user1={currentUserId} user2={secondUser}/>
		<UserList userDisplayFunction={selectSecondUserDisplayFunc} filterUserIds={[currentUserId]} />
		</>
	)}
}