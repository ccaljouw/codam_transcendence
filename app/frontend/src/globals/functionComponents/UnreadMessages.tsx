import { useContext, useEffect, useState } from "react";
import { TranscendenceContext } from "@ft_global/contextprovider.globalvar";
import { constants } from "@ft_global/constants.globalvar";
// import DataFetcherJson from "./DataFetcherJson";
import useFetch from "./useFetch";

/**
 * Function to display unread messages next to a user (hopefully later on also next to a chat, but that needs work)
 * @param props secondUserId: id of the user sending messages, indexInUserList: index of the user in the user list, statusChangeCallBack: callback to update the user list
 * @returns JSX.Element
 */
export default function UnreadMessages(props: {secondUserId:number, indexInUserList: number, statusChangeCallBack: (idx: number) => void}) {
  const {messageToUserNotInRoom, currentUser, currentChatRoom} = useContext(TranscendenceContext);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [chatId, setChatId] = useState(-1);
  const {data: chatIdFromDb, isLoading: chatIdLoading, error: chatIdError, fetcher: chatIdFetcher} = useFetch<null, number>();
  const {data: unreadsFromDb, isLoading: unreadsLoading, error: unreadsError, fetcher: unreadsFetcher} = useFetch<null, number>();
  
  // Fetch chatId when component is mounted
  useEffect(() => {
	fetchChatId();
  },[]);

  // Fetch unreads when chatId is set
  useEffect(() => {
	fetchUnreads();
  },[chatId]);

  useEffect(() => {
	if (currentChatRoom === chatId)
		setUnreadMessages(0);
  },[currentChatRoom]);

  // Update unread messages when messageToUserNotInRoom is sent
  useEffect(() => {
	if (messageToUserNotInRoom === undefined)
		return ;
	if (parseInt(messageToUserNotInRoom.room) === chatId)
	{
		setUnreadMessages(unreadMessages + 1);
		props.statusChangeCallBack(props.indexInUserList);
		return ;
	}
	if (messageToUserNotInRoom.userId === props.secondUserId)
	{
		fetchChatId();
		return ;
	}
  },[messageToUserNotInRoom]);

  useEffect(() => {
	if (chatIdFromDb)
		setChatId(chatIdFromDb);
  }
  ,[chatIdFromDb]);

  useEffect(() => {
	console.log("unreads useEffect", unreadsFromDb, chatIdFromDb);
	if (unreadsFromDb)
		setUnreadMessages(unreadsFromDb);
  },[unreadsFromDb]);

  const fetchChatId = async () => {
	if(!currentUser.id || !props.secondUserId)
		return;
	await chatIdFetcher({url: constants.CHAT_CHECK_IF_DM_EXISTS + `${currentUser.id}/${props.secondUserId}`});
  }

  const fetchUnreads = async () => {
	if(chatId === -1) // If chatId is not set, return
		return;
	await unreadsFetcher({url: constants.CHAT_GET_UNREADS + `${chatId}/${currentUser.id}`});
  }

  return (
	<>
	{(chatIdLoading || unreadsLoading) && "L"}
	{(chatIdError || unreadsError) && "E"}
	{unreadMessages > 0 ?
		"(" + unreadMessages +")" :
		"" }</>
  );
}