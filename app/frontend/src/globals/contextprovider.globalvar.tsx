"use client"

import ChatArea from "../app/components/ChatArea";
import { createContext, useContext, useEffect, useState } from "react";
import { transcendenceConnect, transcendenceSocket } from "./socket.globalvar";

interface TranscendenceContextVars {
	someUserUpdatedTheirStatus: boolean;
	setSomeUserUpdatedTheirStatus: (val: boolean) => void;
	currentUserId: number;
	setCurrentUserId: (val: number) => void;
	currentUserName: string;
	setCurrentUserName: (val: string) => void;
}

export const TranscendenceContext = createContext<TranscendenceContextVars>({
	someUserUpdatedTheirStatus: false,
	setSomeUserUpdatedTheirStatus: () => { },
	currentUserId: 0,
	setCurrentUserId: () => { },
	currentUserName: '',
	setCurrentUserName: () => { }
});

export function ContextProvider({ children }: { children: React.ReactNode }) {

	const [someUserUpdatedTheirStatus, setSomeUserUpdatedTheirStatus] = useState(false);
	const [currentUserId, setCurrentUserId] = useState(0);
	const [currentUserName, setCurrentUserName] = useState('');

	useEffect(() => {
		transcendenceSocket.on('socket/statusChange', (msg: string) => {
			const prev = someUserUpdatedTheirStatus;
			setSomeUserUpdatedTheirStatus(!prev);
		});

		return () => {
			transcendenceSocket.off('socket/statusChange');
		}

	})

	useEffect(() => {
		console.log(`CONTEXT connecting for ${currentUserId}`)
		transcendenceConnect(currentUserId.toString());
	}, [currentUserId])


	const contextValues: TranscendenceContextVars = {
		someUserUpdatedTheirStatus,
		setSomeUserUpdatedTheirStatus,
		currentUserId,
		setCurrentUserId,
		currentUserName,
		setCurrentUserName
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