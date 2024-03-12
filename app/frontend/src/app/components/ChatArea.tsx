"use client"
import { useContext, useEffect, useState } from 'react';
import UserList from 'src/components/UserList';
import { UserProfileDto } from '../../../../backend/src/users/dto/user-profile.dto'
import Chat from '../components/Chat'
import { TranscendenceContext } from 'src/globals/contextprovider.globalvar';
import { constants } from 'src/globals/constants.globalvar';
import DataFetcherJson from 'src/components/DataFetcherJson';
import StatusIndicator from 'src/components/StatusIndicator';
import UnreadMessages from 'src/components/UnreadMessages';

export default function ChatArea() {
	const [secondUser, setSecondUser] = useState(0);
	const { currentUserId, setCurrentUserId, currentUserName, setCurrentUserName } = useContext(TranscendenceContext)

	useEffect(() => {
		// If we have a user in session storage, set it as the current user
		if (typeof window !== 'undefined' && sessionStorage && sessionStorage.getItem != null) { //
			const userIdFromSession = sessionStorage.getItem('userId');
			if (userIdFromSession && userIdFromSession != '')
				setCurrentUserId(parseInt(userIdFromSession));
		}

		// If secondUser is set and currentUserId is set, fetch the chatId
		if (secondUser) {
			const chat = fetchDMId(currentUserId, secondUser);
			const cur = new Date();
			console.log(cur);
		}

	}, [currentUserId, secondUser])

	// Fetch DM ID from database (if no dm is created, it creates one)
	const fetchDMId = async (user1: number, user2: number) => {
		const response = await DataFetcherJson({ url: constants.CHAT_CHECK_IF_DM_EXISTS + `${user1}/${user2}` });
		if (response instanceof Error) {
			console.log("Error fetching DM id");
			return -1;
		}
		return response;
	}

	// Fetch all users but the current user
	const selectDMFriend = (): Promise<UserProfileDto[]> => {
		return DataFetcherJson({ url: constants.API_ALL_USERS_BUT_ME + currentUserId });
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
				<Chat user1={currentUserId} user2={secondUser} />
				: <><h3>Hello {currentUserName}, Who do you wanna chat with?</h3></>
			}
			<UserList userDisplayFunction={selectSecondUserDisplayFunc} userFetcherFunction={selectDMFriend} />
		</>
	)

}