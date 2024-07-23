import { useContext, useEffect, useState } from "react";
import { TranscendenceContext } from "../contextprovider.globalvar";
import { OnlineStatus } from "@prisma/client";
import { stat } from "fs";

const StatusDisplay = {
	IN_CHANNEL: '🔵',
	ONLINE: '🟠',
	OFFLINE: '🔴',
};

export default function ChannelStatusIndicator(props: { userId: number, onlineStatus: OnlineStatus }): JSX.Element {
	const { currentChatRoom, someUserUpdatedTheirStatus } = useContext(TranscendenceContext);

	const statusSetter = () => {
		if (!currentChatRoom || currentChatRoom.users === undefined) return StatusDisplay.OFFLINE;
		const user = currentChatRoom.users.find(user => user.userId === props.userId);
		if (!user) return StatusDisplay.OFFLINE;

		if (props.onlineStatus !== OnlineStatus.OFFLINE) {
			return user.isInChatRoom ? StatusDisplay.IN_CHANNEL : StatusDisplay.ONLINE;
		} else {
			return StatusDisplay.OFFLINE;
		}
	}

	const [status, setStatus] = useState<string>(statusSetter());

	useEffect(() => {
		setStatus(statusSetter());
	}, [currentChatRoom])

	useEffect(() => {
		if (someUserUpdatedTheirStatus === undefined) return;
		if (someUserUpdatedTheirStatus.userId === props.userId && someUserUpdatedTheirStatus.status == OnlineStatus.OFFLINE) {
			setStatus(StatusDisplay.OFFLINE);
		}
		else if (someUserUpdatedTheirStatus.userId === props.userId && someUserUpdatedTheirStatus.status == OnlineStatus.ONLINE) {
			setStatus(StatusDisplay.ONLINE);
		}

	}, [someUserUpdatedTheirStatus])

	return (
		<>
			{status}
		</>
	);


}