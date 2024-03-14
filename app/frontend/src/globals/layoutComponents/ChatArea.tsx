"use client"
import { useContext, useEffect, useState } from 'react';
import { UserProfileDto } from '@dto/users'
import { TranscendenceContext, constants } from '@global/vars';
import UserList from '@functionComponents/UserList';
import DataFetcherJson from '@functionComponents/DataFetcherJson';
import StatusIndicator from '@functionComponents/StatusIndicator';
import UnreadMessages from '@functionComponents/UnreadMessages';
import Chat from './Chat'

export default function ChatArea() {
	const [secondUser, setSecondUser] = useState(0);
	const {currentUser, setCurrentUser} = useContext(TranscendenceContext)

	useEffect(() => {
		// // If we have a user in session storage, set it as the current user
		// if (typeof window !== 'undefined' && sessionStorage && sessionStorage.getItem != null) { //
		// 	const userIdFromSession = sessionStorage.getItem('userId');
		// 	if (userIdFromSession && userIdFromSession != '')
		// 		setCurrentUserId(parseInt(userIdFromSession));
		// }

		console.log("ChatArea: ", currentUser.id, secondUser);
		// If secondUser is set and currentUserId is set, fetch the chatId
		if (secondUser && currentUser.id !== undefined && currentUser.id !== 0) {
			const chat = fetchDMId();
			const cur = new Date();
			console.log(cur);
		}

	}, [currentUser, secondUser])

	// Fetch DM ID from database (if no dm is created, it creates one)
	const fetchDMId = async () => {
		console.log(`Fetching DM id between ${currentUser.id} and ${secondUser}`);
		const response = await DataFetcherJson({ url: constants.CHAT_CHECK_IF_DM_EXISTS + `${currentUser.id}/${secondUser}` });
		if (response instanceof Error) {
			console.log("Error fetching DM id");
			return -1;
		}
		return response;
	}

	// Fetch all users but the current user
	const selectDMFriend = (): Promise<UserProfileDto[]> => {
		return DataFetcherJson({ url: constants.API_ALL_USERS_BUT_ME + currentUser.id });
	}

	// Function to display users in the userlist
	const selectSecondUserDisplayFunc = (user: UserProfileDto, indexInUserList: number, statusChangeCallback: (idx: number) => void) => {
		return (
			<li key={user.id} onClick={() => { setSecondUser(user.id); console.log(`Second user set to ${user.id}`) }}>
				<StatusIndicator
					userId={user.id}
					status={user.online}
					statusChangeCallback={statusChangeCallback}
					indexInUserList={indexInUserList} /> {user.firstName} {user.lastName} - {user.email}
				<b> <UnreadMessages secondUserId={user.id} indexInUserList={indexInUserList} statusChangeCallBack={statusChangeCallback} /></b>
			</li>
		)
	}


	return (
		<>
			{secondUser ?
				<Chat user1={currentUser.id} user2={secondUser} />
				: <><h3>Hello {currentUser.userName}, Who do you wanna chat with?</h3></>
			}
			<UserList userDisplayFunction={selectSecondUserDisplayFunc} userFetcherFunction={selectDMFriend} />
		</>
	)

}