"use client"

import ChatArea from "../app/components/ChatArea";
import { createContext, useEffect, useState } from "react";
import { transcendenceSocket } from "./socket.globalvar";
import { UpdateUserDto } from "@dto/users/update-user.dto";
import { OnlineStatus } from "@prisma/client";
import { constants } from "./constants.globalvar";
import { WebsocketStatusChangeDto } from '../../../backend/src/socket/dto/statuschange'
import Login from "src/components/Login";
import { UserProfileDto } from "@dto/users/user-profile.dto";
import { ChatMessageToRoomDto } from "@dto/chat/chat-messageToRoom.dto";

// Context for the entire app
interface TranscendenceContextVars {
	currentUser: UserProfileDto;
	setCurrentUser: (val: UserProfileDto) => void;
	someUserUpdatedTheirStatus: WebsocketStatusChangeDto;
	setSomeUserUpdatedTheirStatus: (val: WebsocketStatusChangeDto) => void;
	// currentUserId: number;
	// setCurrentUserId: (val: number) => void;
	// currentUserName: string;
	// setCurrentUserName: (val: string) => void;
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
	// currentUserId: 0,
	// setCurrentUserId: () => { },
	// currentUserName: '',
	// setCurrentUserName: () => { },
	currentChatRoom: -1,
	setCurrentChatRoom: () => { },
	messageToUserNotInRoom: {} as ChatMessageToRoomDto,
	setMessageToUserNotInRoom: () => { }
});

export function ContextProvider({ children }: { children: React.ReactNode }) {

	const [someUserUpdatedTheirStatus, setSomeUserUpdatedTheirStatus] = useState<WebsocketStatusChangeDto>({} as WebsocketStatusChangeDto);
	// const [currentUserId, setCurrentUserId] = useState<number>(0);
	// const [currentUserName, setCurrentUserName] = useState<string>('');
	const [messageToUserNotInRoom, setMessageToUserNotInRoom] = useState<ChatMessageToRoomDto>({} as ChatMessageToRoomDto);
	const [currentChatRoom, setCurrentChatRoom] = useState<number>(-1);
	const [currentUser, setCurrentUser] = useState<UserProfileDto>({} as UserProfileDto);

	useEffect(() => {
		// console.log("CONTEXT ", transcendenceSocket.id, currentUser.id,);

		// Listener for status changes of other users
		transcendenceSocket.on('socket/statusChange', (payload: WebsocketStatusChangeDto) => {
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
		// currentUserId,
		// setCurrentUserId,
		// currentUserName,
		// setCurrentUserName,
		currentChatRoom,
		setCurrentChatRoom,
		messageToUserNotInRoom,
		setMessageToUserNotInRoom
	}

	// Function to update the user's online status
	const setUserStatusToOnline = async () => {
		if (!currentUser.id) return;
		try {
			const updateData: UpdateUserDto = {
				online: OnlineStatus.ONLINE,
				token: transcendenceSocket.id
			}
			const response = await fetch(constants.API_SINGLE_USER + currentUser.id, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updateData),
			});
			if (!response.ok) {
				throw new Error('Failed to patch data');
			} else {
				const data = await response.json() as UserProfileDto;
				const statusUpdate: WebsocketStatusChangeDto = {
					userId: data.id,
					userName: data.userName,
					token: (transcendenceSocket.id ? transcendenceSocket.id : ''),
					status: OnlineStatus.ONLINE
				}
				// setCurrentUserName(data.loginName);
				setCurrentUser(data);
				transcendenceSocket.emit('socket/statusChange', statusUpdate); // Emit the status change to the socket
			}
		} catch (error) {
			console.error('Error updating online status:', error);
		}
	};

	// if (currentUser.id == 0)
	// {
	// 	return (
	// 		<Login currentUserId={currentUserId} setCurrentUserId={setCurrentUserId} currentUserName={currentUserName} setCurrentUserName={setCurrentUserName} />
	// 		// <Login />
	// 	);
	// }

	return (
		<>
			<TranscendenceContext.Provider value={contextValues}>
				{!currentUser.id && <Login />}
				{currentUser.id && 
				<div className="content-area">
					<div className="page">
						{children}
					</div>
					<div className="chat">
						<ChatArea />
					</div>
				</div>}
			</TranscendenceContext.Provider>
		</>
	)
}
