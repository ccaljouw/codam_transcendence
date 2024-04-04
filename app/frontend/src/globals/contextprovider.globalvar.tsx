"use client";
import { createContext, useEffect, useState } from "react";
import { OnlineStatus } from "@prisma/client";
import { UserProfileDto, UpdateUserDto } from "@ft_dto/users";
import { ChatMessageToRoomDto } from "@ft_dto/chat";
import { WebsocketStatusChangeDto, CreateTokenDto } from '@ft_dto/socket'
import { constants } from "@ft_global/constants.globalvar";
import { transcendenceSocket } from '@ft_global/socket.globalvar'
import ChatArea from "./layoutComponents/ChatArea";
import MenuBar from "./layoutComponents/MenuBar";
import Login from "./layoutComponents//Login";
import DottedCircles from "./layoutComponents/DottedCircles";
import useFetch from "./functionComponents/useFetch";

// Context for the entire app
interface TranscendenceContextVars {
	currentUser: UserProfileDto;
	setCurrentUser: (val: UserProfileDto) => void;
	someUserUpdatedTheirStatus: WebsocketStatusChangeDto;
	setSomeUserUpdatedTheirStatus: (val: WebsocketStatusChangeDto) => void;
	currentChatRoom: number;
	setCurrentChatRoom: (val: number) => void;
	messageToUserNotInRoom: ChatMessageToRoomDto;
	setMessageToUserNotInRoom: (val: ChatMessageToRoomDto) => void;
}

// Initialize the context
export const TranscendenceContext = createContext<TranscendenceContextVars>({
	currentUser: {} as UserProfileDto,
	setCurrentUser: () => { },
	someUserUpdatedTheirStatus: {} as WebsocketStatusChangeDto,
	setSomeUserUpdatedTheirStatus: () => { },
	currentChatRoom: -1,
	setCurrentChatRoom: () => { },
	messageToUserNotInRoom: {} as ChatMessageToRoomDto,
	setMessageToUserNotInRoom: () => { }
});

export function ContextProvider({ children }: { children: React.ReactNode }) {

	const [someUserUpdatedTheirStatus, setSomeUserUpdatedTheirStatus] = useState<WebsocketStatusChangeDto>({} as WebsocketStatusChangeDto);
	const [messageToUserNotInRoom, setMessageToUserNotInRoom] = useState<ChatMessageToRoomDto>({} as ChatMessageToRoomDto);
	const [currentChatRoom, setCurrentChatRoom] = useState<number>(-1);
	const [currentUser, setCurrentUser] = useState<UserProfileDto>({} as UserProfileDto);
	const {data: userPatch, isLoading: userPatchLoading, error: userPatchError, fetcher: patchUserFetcher} = useFetch<UpdateUserDto, UserProfileDto>();
	const {data: addToken, isLoading: addTokenLoading, error: addTokenError, fetcher: addTokenFetcher} = useFetch<CreateTokenDto, boolean>();

	useEffect(() => {
		// console.log("CONTEXT ", transcendenceSocket.id, currentUser.id,);

		// Listener for status changes of other users
		transcendenceSocket.on('socket/statusChange', (payload: WebsocketStatusChangeDto) => {
			console.log('User status change:', payload);
			setSomeUserUpdatedTheirStatus(payload);
		});

		// Listener for messenges to chats the user is subscribed to but not currently in
		transcendenceSocket.on('chat/messageToUserNotInRoom', (payload: ChatMessageToRoomDto) => {
			setMessageToUserNotInRoom(payload);
		});

		//	Listener for when the socket connects: update the user's status to online
		transcendenceSocket.on('connect', () => {
			setUserStatusToOnline();
		});

		return () => { // Cleanup socket listeners
			transcendenceSocket.off('socket/statusChange');
			transcendenceSocket.off('socket/messageToUserNotInRoom');
			transcendenceSocket.off('connect');
		}

	}, [])

	// Update the user's status to online when the user logs in
	useEffect(() => {
		if (transcendenceSocket.id && transcendenceSocket.id != '0' && currentUser.id != 0) {
			setUserStatusToOnline();
		}
	}, [currentUser.id])

	// Context values to be passed to the children components
	const contextValues: TranscendenceContextVars = {
		currentUser,
		setCurrentUser,
		someUserUpdatedTheirStatus,
		setSomeUserUpdatedTheirStatus,
		currentChatRoom,
		setCurrentChatRoom,
		messageToUserNotInRoom,
		setMessageToUserNotInRoom
	}

	useEffect(() => {
		if (userPatch) {
			setCurrentUser(userPatch);
		}
	}, [userPatch])

	useEffect(() => {
		if (addToken) {
			const statusUpdate: WebsocketStatusChangeDto = {
				userId: currentUser.id,
				userName: currentUser.userName,
				token: (transcendenceSocket.id ? transcendenceSocket.id : ''),
				status: OnlineStatus.ONLINE
			}
			console.log('User status updated to online:', currentUser.id,currentUser.userName, transcendenceSocket.id, statusUpdate);
			transcendenceSocket.emit('socket/statusChange', statusUpdate); // Emit the status change to the socket
		}
	}, [addToken])

	useEffect(() => {
		if (userPatchError) {
			console.error('Error updating user:', userPatchError);
		}
		if (addTokenError) {
			console.error('Error adding token:', addTokenError);
		}
	}, [userPatchError, addTokenError])

	// Function to update the user's online status
	const setUserStatusToOnline = async () => {
		console.log('Setting user status to online');
		if (!currentUser.id) return;
		// try {
			const patchUserData: UpdateUserDto = {
				online: OnlineStatus.ONLINE,
			}
			const addTokenData: CreateTokenDto = {
				token: transcendenceSocket.id? transcendenceSocket.id : '',
				userId: currentUser.id
			}
			patchUserFetcher({url: constants.API_USERS + currentUser.id, fetchMethod: 'PATCH', payload: patchUserData});
			addTokenFetcher({url: constants.API_ADD_TOKEN, fetchMethod: 'POST', payload: addTokenData });
	};

	return (
		<>
			<TranscendenceContext.Provider value={contextValues}>
				{/* <DottedCircles /> { //JMA: Leave this for now */}
				<MenuBar />
				{!currentUser.id && <Login />}
				{currentUser.id && 
				<div className="content-area text-center">
					<div className="page">
						{children}
					</div>
					<div className="chat-area">
						<ChatArea />
					</div>
				</div>}
			</TranscendenceContext.Provider>
		</>
	)
}
