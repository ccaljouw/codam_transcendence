import { UpdateInviteDto } from "@ft_dto/chat";
import { useContext, useEffect, useState } from "react";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar";

export default function ChatLoader({invite}: {invite: UpdateInviteDto | undefined}): JSX.Element {
	if (!invite) // If no invite is passed, don't show loader
		return <></>;

	const {newChatRoom, setNewChatRoom, switchToChannelCounter, setSwitchToChannelCounter} = useContext(TranscendenceContext);
	const switchRoom = () => {
		setNewChatRoom({room: invite.chatId? invite.chatId : -1, count: newChatRoom.count + 1});
	}

	if (switchToChannelCounter.invite != invite.id) // Only show loader if the invite is the one that was clicked
		return <></>;

	useEffect(() => { // If the invite is the one that was clicked, start the countdown
		if (switchToChannelCounter.count > 0) {
			setTimeout(() => setSwitchToChannelCounter({channel: switchToChannelCounter.channel, count: switchToChannelCounter.count - 1, invite: switchToChannelCounter.invite}), 1000);
		}
		else { // If the countdown is done, switch to the channel
			switchRoom(); //
		}
	}, [switchToChannelCounter.count]);

	return <>returning to channel in {switchToChannelCounter.count}</>;
}