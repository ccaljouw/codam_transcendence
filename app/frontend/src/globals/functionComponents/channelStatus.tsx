import { useContext, useEffect, useState } from "react";
import { TranscendenceContext } from "../contextprovider.globalvar";
import { OnlineStatus } from "@prisma/client";

export default function ChannelStatusIndicator(props: {userId: number}): JSX.Element {
	const {currentChatRoom,someUserUpdatedTheirStatus} = useContext(TranscendenceContext);
	const [status, setStatus]= useState<boolean>(false);

	// useEffect(() => {
	// 	if (!currentChatRoom || currentChatRoom.users === undefined) return;
	// 	const user = currentChatRoom.users.find(user => user.id === props.userId);
	// 	if (!user) return;
	// 	if (user.isInChatRoom !== status) {
	// 		setStatus(user.isInChatRoom);
	// 	}
	// }, [currentChatRoom])

	useEffect(() => {
		console.log("ChannelStatusIndicator: useEffect", props.userId, currentChatRoom);
		if (!currentChatRoom || currentChatRoom.users === undefined) return;
		const user = currentChatRoom.users.find(user => user.userId === props.userId);
		if (!user) return;
		if (user.isInChatRoom !== status) {
			setStatus(user.isInChatRoom);
		}
	}, [currentChatRoom])

	useEffect(() => {
		if (someUserUpdatedTheirStatus === undefined) return;
		if (someUserUpdatedTheirStatus.userId === props.userId && someUserUpdatedTheirStatus.status == OnlineStatus.OFFLINE) {
			setStatus(false);
		}
	}, [someUserUpdatedTheirStatus])

	return (
		<>
			{status ? '🔵' : '🟠'}
		</>
	);

	
}