"use client"

import ChatArea from "../app/components/ChatArea";
import { createContext, useEffect, useState } from "react";
import { transcendenceSocket } from "./socket.globalvar";
import { UpdateUserDto } from "../../../backend/src/users/dto/update-user.dto";
import { OnlineStatus } from "@prisma/client";
import { constants } from "./constants.globalvar";
import { WebsocketStatusChangeDto } from '../../../backend/src/socket/dto/statuschange'
import Login from "src/components/Login";

interface TranscendenceContextVars {
	someUserUpdatedTheirStatus: WebsocketStatusChangeDto | undefined;
	setSomeUserUpdatedTheirStatus: (val: WebsocketStatusChangeDto) => void;
	currentUserId: number;
	setCurrentUserId: (val: number) => void;
	currentUserName: string;
	setCurrentUserName: (val: string) => void;
}

export const TranscendenceContext = createContext<TranscendenceContextVars>({
	someUserUpdatedTheirStatus: {} as WebsocketStatusChangeDto,
	setSomeUserUpdatedTheirStatus: () => { },
	currentUserId: 0,
	setCurrentUserId: () => { },
	currentUserName: '',
	setCurrentUserName: () => { }
});

export function ContextProvider({ children }: { children: React.ReactNode }) {

	const [someUserUpdatedTheirStatus, setSomeUserUpdatedTheirStatus] = useState<WebsocketStatusChangeDto>();
	const [currentUserId, setCurrentUserId] = useState<number>(0);
	const [currentUserName, setCurrentUserName] = useState<string>('');

	useEffect(() => {
		transcendenceSocket.on('socket/statusChange', (payload: WebsocketStatusChangeDto) => {
			console.log(`Received status change: ${payload.userid} ${payload.username} ${payload.token} ${payload.status}`);
			// const prev = someUserUpdatedTheirStatus;
			setSomeUserUpdatedTheirStatus(payload);
		});

		transcendenceSocket.on('connect',() => {
			if (currentUserId) {
				const updatedProps: UpdateUserDto = {
					online: OnlineStatus.ONLINE,
					token: transcendenceSocket.id
				}
				updateUserStatus(updatedProps);
			}
		});

		return () => {
			transcendenceSocket.off('socket/statusChange');
		}

	})

	useEffect(() => {
		if(transcendenceSocket.id && transcendenceSocket.id != '0' && currentUserId) {
			const updatedProps: UpdateUserDto = {
				online: OnlineStatus.ONLINE,
				token: transcendenceSocket.id
			}
			updateUserStatus(updatedProps);
		}
	}, [currentUserId])


	const contextValues: TranscendenceContextVars = {
		someUserUpdatedTheirStatus,
		setSomeUserUpdatedTheirStatus,
		currentUserId,
		setCurrentUserId,
		currentUserName,
		setCurrentUserName
	}

	const updateUserStatus = async (updatedProps: UpdateUserDto) => {
		try {
			const response = await fetch(constants.BACKEND_ADRESS_FOR_WEBSOCKET + `users/${currentUserId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedProps),
			});
			if (!response.ok) {
				throw new Error('Failed to patch data');
			} else {
	
				const statusUpdate : WebsocketStatusChangeDto  = {
					userid: currentUserId,
					username: currentUserName,
					token: (transcendenceSocket.id ? transcendenceSocket.id : ''),
					status: OnlineStatus.ONLINE
				}
				transcendenceSocket.emit('socket/statusChange', statusUpdate);
			}
			// 	const result = await response.json();
			// 	setData(result);
		} catch (error) {
			console.error('Error updating online status:', error);
		}
	};
	// updateUserStatus(updatedProps);

	if (!currentUserId)
	{
		return (
			<Login currentUserId={currentUserId} setCurrentUserId={setCurrentUserId} currentUserName={currentUserName} setCurrentUserName={setCurrentUserName}/>
		);
	}

	return (
		<>
			<TranscendenceContext.Provider value={contextValues}>
				<div className="content-area">
					<div className="page">
						{children}
					</div>
					<div className="chat">
						<ChatArea />
					</div>
				</div>
			</TranscendenceContext.Provider>
		</>
	)
}