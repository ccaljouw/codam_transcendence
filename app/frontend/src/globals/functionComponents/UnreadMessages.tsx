import { useContext, useEffect, useState } from "react";
import { TranscendenceContext } from "@ft_global/contextprovider.globalvar";
import { constants } from "@ft_global/constants.globalvar";
import useFetch from "./useFetch";
import { OnlineStatus } from "@prisma/client";
import { IsBlocked, IsFriend } from "./FriendOrBlocked";

/**
 * Function to display unread messages next to a user (hopefully later on also next to a chat, but that needs work)
 * @param props secondUserId: id of the user sending messages, indexInUserList: index of the user in the user list, statusChangeCallBack: callback to update the user list
 * @returns JSX.Element
 */
export default function UnreadMessages(props: { secondUserId: number, indexInUserList: number, statusChangeCallBack: (idx: number) => void }) {
	const { messageToUserNotInRoom, currentUser, currentChatRoom, allUsersUnreadCounter, setAllUsersUnreadCounter, friendsUnreadCounter, setFriendsUnreadCounter } = useContext(TranscendenceContext);
	const [unreadMessages, setUnreadMessages] = useState(0);
	const [chatId, setChatId] = useState(-1);
	const { data: chatIdFromDb, isLoading: chatIdLoading, error: chatIdError, fetcher: chatIdFetcher } = useFetch<null, number>();
	const { data: unreadsFromDb, isLoading: unreadsLoading, error: unreadsError, fetcher: unreadsFetcher } = useFetch<null, number>();
	const secondUserIsFriend = IsFriend(props.secondUserId, currentUser);
	const secondUserIsBlocked = IsBlocked(props.secondUserId, currentUser);

	const resetCounters = () => {
		if (unreadMessages !== 0) {
			setAllUsersUnreadCounter(allUsersUnreadCounter - unreadMessages);
			if (secondUserIsFriend)
				setFriendsUnreadCounter(friendsUnreadCounter - unreadMessages);
		}
		setUnreadMessages(0);
	}
	// Fetch chatId when component is mounted
	useEffect(() => {
		if (secondUserIsBlocked)
			return;
		fetchChatId();
	}, []);

	// Fetch unreads when chatId is set
	useEffect(() => {
		if (secondUserIsBlocked)
			return;
		fetchUnreads();
	}, [chatId]);

	useEffect(() => {
		if (currentChatRoom.id === chatId) {
			resetCounters();
		}
	}, [currentChatRoom]);

	// Update unread messages when messageToUserNotInRoom is sent
	useEffect(() => {
		if (messageToUserNotInRoom === undefined) // If messageToUserNotInRoom is not set, return
			return;
		if (parseInt(messageToUserNotInRoom.room) === chatId) // If the message is for the current chat, adjust the unread messages
		{
			setUnreadMessages(unreadMessages + 1);
			// setAllUsersUnreadCounter(allUsersUnreadCounter + 1);
			// if (secondUserIsFriend)
				// setFriendsUnreadCounter(friendsUnreadCounter + 1);

			props.statusChangeCallBack(props.indexInUserList);
			return;
		}
		if (messageToUserNotInRoom.userId === props.secondUserId)  // If we reach this point, the chatId is not set, so we need to fetch it if the message is from the user
		{
			fetchChatId();
			return;
		}
	}, [messageToUserNotInRoom]);

	useEffect(() => {
		if (chatIdFromDb) // If chatId is set, update the state
			setChatId(chatIdFromDb);
	}
		, [chatIdFromDb]);

	useEffect(() => {
		if (unreadsFromDb && unreadMessages !== unreadsFromDb && !IsBlocked(props.secondUserId, currentUser)) // if unreadsFromDb have arrived and are different from the current state, update the state
		{
			setUnreadMessages(unreadsFromDb);
			// setAllUsersUnreadCounter(allUsersUnreadCounter + unreadsFromDb);
			// if (secondUserIsFriend)
				// setFriendsUnreadCounter(friendsUnreadCounter + unreadsFromDb);
		}
	}, [unreadsFromDb]);

	useEffect(() => {
		// console.log("currentUser changed UnreadMessages.tsx", IsBlocked(props.secondUserId, currentUser));
		if (IsBlocked(props.secondUserId, currentUser)) // If the user is blocked, set unreadMessages to 0
			resetCounters();
	}, [currentUser]);

	const fetchChatId = async () => {
		if (!currentUser.id || !props.secondUserId || chatId !== -1)
			return;
		await chatIdFetcher({ url: constants.CHAT_CHECK_IF_DM_EXISTS + `${currentUser.id}/${props.secondUserId}` });
	}

	const fetchUnreads = async () => {
		if (chatId === -1) // If chatId is not set, return
			return;
		await unreadsFetcher({ url: constants.CHAT_GET_UNREADS + `${chatId}/${currentUser.id}` });
	}

	return (
		<>
			{(chatIdLoading || unreadsLoading) && "L"}
			{(chatIdError || unreadsError) && "E"}
			{unreadMessages > 0 ?
				"(" + unreadMessages + ")" :
				""}</>
	);
}