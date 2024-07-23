import { FetchChatDto } from "@ft_dto/chat";
import { use, useContext, useEffect, useState } from "react";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar";
import useFetch from "src/globals/functionComponents/useFetch";
import { constants } from "src/globals/constants.globalvar";

export default function ChannelList(): JSX.Element {
	const { currentUser, newChatRoom, setNewChatRoom } = useContext(TranscendenceContext);
	const [newChannelSet, setNewChannelSet] = useState<boolean>(false);
	const { data: channelList, error: channelError, isLoading: channelLoading, fetcher: channelListFetcher } = useFetch<null, FetchChatDto[]>();
	const { data: newChannel, error: newChannelError, isLoading: newChannelLoading, fetcher: newChannelFetcher } = useFetch<null, FetchChatDto>();

	const addChannel = () => {
		console.log('addChannel');
		setNewChannelSet(true);
		newChannelFetcher({ url: constants.CHAT_NEW_CHANNEL + currentUser.id });
	}

	useEffect(() => {
		channelListFetcher({ url: constants.CHAT_CHANNELS_FOR_USER + currentUser.id });
	}, []);

	useEffect(() => {
		if (!newChannel) return;
		setNewChannelSet(false);
		setNewChatRoom({ room: newChannel.id, count: newChatRoom.count++ });
	}, [newChannel]);

	const channelClickHandler = (channel: FetchChatDto) => {
		setNewChatRoom({ room: channel.id, count: newChatRoom.count++ });
	}

	return (<>
		{!newChannelSet && <span className='channelListLink' onClick={() => addChannel()}>[+] Make new channel</span>}
		{newChannelLoading && <div>Creating new channel...</div>}
		{newChannelError && <div>Error creating new channel <span className='channelListLink' onClick={() => addChannel()}>try again</span></div>}
		{channelLoading && <div>Loading...</div>}
		{channelError && <div>Error loading channels</div>}
		{channelList && channelList.map((channel) => {
			return (
				<div key={channel.id} className='channel'>
					<span className="channelListLink" onClick={() => channelClickHandler(channel)
					}>{channel.name} {channel.id}</span>
				</div>
			)
		})}
	</>
	)
}