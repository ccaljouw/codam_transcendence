import { useContext, useEffect, useState } from "react";
import { TranscendenceContext } from "../contextprovider.globalvar";
import { OnlineStatus } from "@prisma/client";
import useFetch from '@ft_global/functionComponents/useFetch';
import { UpdateChatUserDto } from "@ft_dto/chat";
import { constants } from "../constants.globalvar";


const StatusDisplay = {
	IN_CHANNEL: '🔵',
	ONLINE: '🟠',
	OFFLINE: '🔴',
};

export default function ChannelStatusIndicator(props: { userId: number, onlineStatus: OnlineStatus }): JSX.Element {
	const { currentChatRoom, someUserUpdatedTheirStatus } = useContext(TranscendenceContext);
	const { data: chatUser, isLoading: chatUserIsLoading, error: chatUserError, fetcher: chatUserFetcher } = useFetch<null, UpdateChatUserDto>();
	const [status, setStatus] = useState<string>(OnlineStatus.OFFLINE);

	// const statusSetter = () => {
	// 	if (!currentChatRoom || currentChatRoom.users === undefined) return StatusDisplay.OFFLINE;
	// 	const user = currentChatRoom.users.find(user => user.userId === props.userId);
	// 	if (!user) return StatusDisplay.OFFLINE;
	// 	if (user.isInChatRoom) 
	// 			console.log('user in channel', user);
	// 	else
	// 		console.log('user not in channel', user);
	// 	if (props.onlineStatus !== OnlineStatus.OFFLINE) {
	// 		return user.isInChatRoom ? StatusDisplay.IN_CHANNEL : StatusDisplay.ONLINE;
	// 	} else {
	// 		return StatusDisplay.OFFLINE;
	// 	}
	// }


	useEffect(() => {
		console.log("ChannelStatus: currentChatRoom UseEffect");
		chatUserFetcher({url: constants.CHAT_GET_CHATUSER + currentChatRoom.id + '/' + props.userId})
		// setStatus(statusSetter());
	}, [currentChatRoom])


	useEffect(() => {
		console.log("ChannelStatus: chatUser UseEffect", chatUser);
		if (chatUser === undefined || chatUser === null) return;
		if (chatUser.isInChatRoom) {
			setStatus(StatusDisplay.IN_CHANNEL);
		} else {
			setStatus(StatusDisplay.ONLINE);
		}
	}, [chatUser])

	useEffect(() => {
		console.log('someUserUpdatedTheirStatus', someUserUpdatedTheirStatus);
		if (someUserUpdatedTheirStatus === undefined ) return;
		if (someUserUpdatedTheirStatus.userId === props.userId && someUserUpdatedTheirStatus.status == OnlineStatus.OFFLINE) {
			setStatus(StatusDisplay.OFFLINE);
		}
		else if (someUserUpdatedTheirStatus.userId === props.userId && someUserUpdatedTheirStatus.status == OnlineStatus.ONLINE) {
			if (status === StatusDisplay.IN_CHANNEL) return;
			console.log('setting status to online');
			setStatus(StatusDisplay.ONLINE);
		}

	}, [someUserUpdatedTheirStatus])

	return (
		<>
			{status}
		</>
	);


}