import { UpdateInviteDto } from "@ft_dto/chat";
import { useContext, useEffect, useRef, useState } from "react";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar";

export default function ChannelLoaderCountDown({ invite }: { invite: UpdateInviteDto | undefined }): JSX.Element {


	const { newChatRoom, setNewChatRoom, switchToChannelCounter, setSwitchToChannelCounter } = useContext(TranscendenceContext);
	const timeOutRef = useRef<NodeJS.Timeout | null>(null);
	const switchRoom = () => {
		setNewChatRoom({ room: invite?.chatId ? invite.chatId : -1, count: newChatRoom.count + 1 });
	}

	const cancelCountDown = () => {
		clearTimeout(timeOutRef.current!);
		setSwitchToChannelCounter({ channel: -1, count: 0, invite: -1 });
	}

	useEffect(() => { // If the invite is the one that was clicked, start the countdown
		if (switchToChannelCounter.count > 0) {
			timeOutRef.current = setTimeout(() => setSwitchToChannelCounter({ channel: switchToChannelCounter.channel, count: switchToChannelCounter.count - 1, invite: switchToChannelCounter.invite }), 1000);
		}
		else { // If the countdown is done, switch to the channel
			if (switchToChannelCounter.invite !== -1)
				switchRoom(); //
		}

		return () => {
			if (timeOutRef.current)
				clearTimeout(timeOutRef.current
				);
		}
	}, [switchToChannelCounter.count]);

	if (!invite || switchToChannelCounter.invite !== invite.id) {
		return <></>;
	  }

	return <>returning to channel in [ {switchToChannelCounter.count} ] or [ <span className={'invite-button'} onClick={() => cancelCountDown()}>cancel</span> ]</>;
}