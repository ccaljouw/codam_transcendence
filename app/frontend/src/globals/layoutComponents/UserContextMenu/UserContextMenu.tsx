import { UserProfileDto } from '@ft_dto/users';
import style from './styles.module.css';
import { useContext, useEffect, useState } from 'react';
import { UserListContext } from 'src/globals/functionComponents/UserList';
import { transcendenceSocket } from 'src/globals/socket.globalvar';
import { TranscendenceContext } from 'src/globals/contextprovider.globalvar';
import { ChatMessageToRoomDto, CreateDMDto, CreateInviteDto, UpdateChatDto, UpdateInviteDto } from '@ft_dto/chat';
import useFetch from 'src/globals/functionComponents/useFetch'
import { constants } from 'src/globals/constants.globalvar';
import { IsFriend } from 'src/globals/functionComponents/FriendOrBlocked';
import { ChatType, InviteType } from '@prisma/client';
import { useRouter } from 'next/navigation';

export default function UserContextMenu({ user }:
	{
		user: UserProfileDto,
	}): JSX.Element {
	const [isDropdownVisible, setDropdownVisible] = useState(false);
	const [socketPayload, setSocketPayload] = useState<ChatMessageToRoomDto | null>();
	const { contextMenuClickSent, triggerContextMenuClick } = useContext(UserListContext);
	const { currentUser, newChatRoom, setNewChatRoom, currentChatRoom } = useContext(TranscendenceContext);
	const { data: invite, isLoading: inviteLoading, error: inviteError, fetcher: inviteFetcher } = useFetch<CreateInviteDto, UpdateInviteDto>();
	const { data: chat, isLoading: chatLoading, error: chatError, fetcher: chatFetcher } = useFetch<CreateDMDto, UpdateChatDto>();
	const userIsFriend = IsFriend(user.id, currentUser);
	const router = useRouter();

	useEffect(() => {
		if (contextMenuClickSent !== user.id) // close dropdown if another user was clicked
			setDropdownVisible(false);
	}, [contextMenuClickSent]);

	useEffect(() => { // send message to room if chat room is set
		if (socketPayload && currentChatRoom.id == parseInt(socketPayload.room)) {
			transcendenceSocket.emit('chat/msgToRoom', socketPayload);
			setSocketPayload(null); // reset payload so it doesn't send again
		}
	}, [currentChatRoom]);


	const toggleMenu = () => {
		triggerContextMenuClick(user.id); // send user id to context menu
		setDropdownVisible(!isDropdownVisible);
	}

	const createInvite = (type: InviteType, chat: number) => {
		setDropdownVisible(false);
		const inviteMessage: CreateInviteDto = {
			chatId: chat,
			senderId: currentUser.id,
			recipientId: user.id,
			type: type,
			state: "SENT"
		}
		inviteFetcher({ url: constants.BACKEND_BASEURL + "invite/create", fetchMethod: 'POST', payload: inviteMessage });
		if (type == InviteType.GAME)
			{
				// should probably navigate to game page here
				router.push('/game');
			console.log(`Invite this user to a game: ${user.userName}`);
			}
	}

	const handleBlockClick = () => {
		setDropdownVisible(false);
		console.log(`Block this user: ${user.userName}`);
		//todo: after blocking a user, the userList should be updated
	}

	useEffect(() => {
		if (invite) {
			if (!chat) {
				const payload: CreateDMDto = {
					user1Id: currentUser.id,
					user2Id: user.id
				}
				chatFetcher({ url: constants.CHAT_CREATE_DM, fetchMethod: 'POST', payload });
			}
			else if (chat.id != currentChatRoom.id) {
				setNewChatRoom({ room: chat.id, count: newChatRoom.count++ }); // set new chat room, count to trigger useEffect
			}
		}
	}, [invite]);



	useEffect(() => {
		if (chat) {
			if (!invite)
				return;
			const payload: ChatMessageToRoomDto = {
				userId: currentUser.id,
				userName: currentUser.userName,
				room: chat.id.toString(),
				message: user.userName,
				action: true,
				inviteId: invite.id
			}
			if (chat.id != currentChatRoom.id) { // if not in chat room, set payload to send message to room
				setSocketPayload(payload);
				setNewChatRoom({ room: chat.id, count: newChatRoom.count++ }); // set new chat room, count to trigger useEffect
			}
			else { // if already in chat room, send message to room
				transcendenceSocket.emit('chat/msgToRoom', payload);
			}
		}
	}, [chat, invite]);

	return (
		<>
			<a onClick={toggleMenu} className={style.userLink}> {!isDropdownVisible ? "☰" : "〣"}</a>
			{isDropdownVisible &&
				<>
					<br />
					&nbsp;&nbsp;&nbsp;&nbsp;
					<span className={style.userlink_item} onClick={() => createInvite(InviteType.GAME, 0)} title='Invite to game'> 🏓</span> |
					{!(currentChatRoom.visibility == ChatType.DM) && <><span className={style.userlink_item} onClick={() => createInvite(InviteType.CHAT, currentChatRoom.id)} title='Invite to chat'>💬</span> |</>}
					{!userIsFriend && <><span className={style.userlink_item} onClick={() => createInvite(InviteType.FRIEND, 0)} title='Invite as friend'>🤝</span> |</>}
					<span className={style.userlink_item} onClick={handleBlockClick} title='Block user'>⛔</span>
				</>}
		</>
	);
}

//todo: expand handleClick functions