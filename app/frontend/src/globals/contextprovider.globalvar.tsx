"use client";
import { createContext, useEffect, useRef, useState } from "react";
import { ChatType, OnlineStatus } from "@prisma/client";
import { UserProfileDto, UpdateUserDto } from "@ft_dto/users";
import { ChatMessageToRoomDto, FetchChatDto } from "@ft_dto/chat";
import { WebsocketStatusChangeDto, CreateTokenDto } from '@ft_dto/socket'
import { constants } from "@ft_global/constants.globalvar";
import { transcendenceSocket } from '@ft_global/socket.globalvar'
import useFetch from "./functionComponents/useFetch";
import useAuthentication from "./functionComponents/useAuthentication";
import { IsBlocked, IsFriend } from "./functionComponents/FriendOrBlocked";
import { usePathname } from "next/navigation";

// Context for the entire app
interface TranscendenceContextVars {
	currentUser: UserProfileDto;
	setCurrentUser: (val: UserProfileDto) => void;
	someUserUpdatedTheirStatus: WebsocketStatusChangeDto;
	setSomeUserUpdatedTheirStatus: (val: WebsocketStatusChangeDto) => void;
	currentChatRoom: FetchChatDto;
	setCurrentChatRoom: (val: FetchChatDto) => void;
	newChatRoom: { room: number, count: number };
	setNewChatRoom: (val: { room: number, count: number }) => void;
	messageToUserNotInRoom: ChatMessageToRoomDto;
	setMessageToUserNotInRoom: (val: ChatMessageToRoomDto) => void;
	allUsersUnreadCounter: number;
	setAllUsersUnreadCounter: (val: number) => void;
	friendsUnreadCounter: number;
	setFriendsUnreadCounter: (val: number) => void;
	switchToChannelCounter: { channel: number, count: number, invite: number };
	setSwitchToChannelCounter: (val: { channel: number, count: number, invite: number }) => void;
}

// Initialize the context
export const TranscendenceContext = createContext<TranscendenceContextVars>({
	currentUser: {} as UserProfileDto,
	setCurrentUser: () => { },
	someUserUpdatedTheirStatus: {} as WebsocketStatusChangeDto,
	setSomeUserUpdatedTheirStatus: () => { },
	currentChatRoom: { id: -1 } as FetchChatDto,
	setCurrentChatRoom: () => { },
	newChatRoom: { room: -1, count: 0 },
	setNewChatRoom: () => { },
	messageToUserNotInRoom: {} as ChatMessageToRoomDto,
	setMessageToUserNotInRoom: () => { },
	allUsersUnreadCounter: 0,
	setAllUsersUnreadCounter: () => { },
	friendsUnreadCounter: 0,
	setFriendsUnreadCounter: () => { },
	switchToChannelCounter: { channel: -1, count: 0, invite: -1 },
	setSwitchToChannelCounter: () => { }
});

export function ContextProvider({ children }: { children: React.ReactNode }) {
	const [someUserUpdatedTheirStatus, setSomeUserUpdatedTheirStatus] = useState<WebsocketStatusChangeDto>({} as WebsocketStatusChangeDto);
	const [messageToUserNotInRoom, setMessageToUserNotInRoom] = useState<ChatMessageToRoomDto>({} as ChatMessageToRoomDto);
	const [currentChatRoom, setCurrentChatRoom] = useState<FetchChatDto>({ id: -1 } as FetchChatDto);
	const [newChatRoom, setNewChatRoom] = useState<{ room: number, count: number }>({ room: -1, count: 0 });
	const [currentUser, setCurrentUser] = useState<UserProfileDto>({} as UserProfileDto);
	const currentUserRef = useRef<UserProfileDto>(currentUser);
	const { user } = useAuthentication();
	const pathname = usePathname();
	const [allUsersUnreadCounter, setAllUsersUnreadCounter] = useState<number>(0);
	const [friendsUnreadCounter, setFriendsUnreadCounter] = useState(0);
	const { data: userPatch, isLoading: userPatchLoading, error: userPatchError, fetcher: patchUserFetcher } = useFetch<UpdateUserDto, UserProfileDto>();
	const { data: addToken, isLoading: addTokenLoading, error: addTokenError, fetcher: addTokenFetcher } = useFetch<CreateTokenDto, boolean>();
	const { data: unreadMessageCount, isLoading: unreadMessageCountLoading, error: unreadMessageCountError, fetcher: unreadMessageCountFetcher } = useFetch<null, number>();
	const { data: unreadsFromFriends, isLoading: unreadsFromFriendsLoading, error: unreadsFromFriendsError, fetcher: unreadsFromFriendsFetcher } = useFetch<number, number>();
	const [switchToChannelCounter, setSwitchToChannelCounter] = useState({ channel: -1, count: 0, invite: -1 });


	useEffect(() => {

		// Listener for status changes of other users
		transcendenceSocket.on('socket/statusChange', (payload: WebsocketStatusChangeDto) => {
			setSomeUserUpdatedTheirStatus(payload);
		});

		// Listener for messenges to chats the user is subscribed to but not currently in
		transcendenceSocket.on('chat/messageToUserNotInRoom', (payload: ChatMessageToRoomDto,) => {
			console.log('Message to user not in room:', payload);
			console.log("User blocked?", IsBlocked(payload.userId, currentUserRef.current));
			console.log("Current user:", currentUserRef.current);
			if (IsBlocked(payload.userId, currentUserRef.current)) {
				console.log('User is blocked, not showing message');
				return;
			};
			setMessageToUserNotInRoom(payload);
		});

		//	Listener for when the socket connects: update the user's status to online
		transcendenceSocket.on('connect', () => {
			setUserStatusToOnline();
		});

		return () => { // Cleanup socket listener
			transcendenceSocket.off('socket/statusChange');
			transcendenceSocket.off('socket/messageToUserNotInRoom');
			transcendenceSocket.off('connect');
		}
	}, []);

	// Update the user's status to online when the user logs in
	useEffect(() => {
		if (transcendenceSocket.id && transcendenceSocket.id != '0' && currentUser && currentUser.id !== undefined && currentUser.id != 0) {
			console.log(`updating user status to online in currentuser.id useEffect in contextprovider`);
			setUserStatusToOnline();

			unreadMessageCountFetcher({ url: constants.CHAT_MESSAGES_UNREAD_FOR_USER + currentUser.id });
			unreadsFromFriendsFetcher({ url: constants.CHAT_UNREAD_MESSAGES_FROM_FRIENDS + currentUser.id });

		}
	}, [currentUser.id])

	useEffect(() => {
		currentUserRef.current = currentUser;
	}, [currentUser]);

	useEffect(() => {
		if (unreadMessageCount) {
			setAllUsersUnreadCounter(unreadMessageCount);
		}
	}, [unreadMessageCount]);

	useEffect(() => {
		if (unreadsFromFriends) {
			setFriendsUnreadCounter(unreadsFromFriends);
		}
	}, [unreadsFromFriends]);


	useEffect(() => {
		if (!messageToUserNotInRoom.userId) return;
		setAllUsersUnreadCounter(allUsersUnreadCounter + 1);
		if (IsFriend(messageToUserNotInRoom.userId, currentUser)) {
			setFriendsUnreadCounter(friendsUnreadCounter + 1);
		}
	}, [messageToUserNotInRoom]);

	// Context values to be passed to the children components
	const contextValues: TranscendenceContextVars = {
		currentUser,
		setCurrentUser,
		someUserUpdatedTheirStatus,
		setSomeUserUpdatedTheirStatus,
		currentChatRoom,
		setCurrentChatRoom,
		newChatRoom,
		setNewChatRoom,
		messageToUserNotInRoom,
		setMessageToUserNotInRoom,
		allUsersUnreadCounter,
		setAllUsersUnreadCounter,
		friendsUnreadCounter,
		setFriendsUnreadCounter,
		switchToChannelCounter,
		setSwitchToChannelCounter
	}

	useEffect(() => {
		if (userPatch) {
			console.log(`userPatch will be saved as currentUser with id: ${userPatch.id}`);
			setCurrentUser(userPatch);
		}
	}, [userPatch]);

	useEffect(() => {
		if (addToken) {
			console.log(`updating usertoken in addToken useEffect in contextprovider`);
			const statusUpdate: WebsocketStatusChangeDto = {
				userId: currentUser.id,
				userName: currentUser.userName,
				token: (transcendenceSocket.id ? transcendenceSocket.id : ''), //Albert: Can the transcendenceSocket.id change while the addTokenFetcher is updating the token in the backend? Should the backend give back a WebsocketStatusChangeDto? - Jorien
				status: OnlineStatus.ONLINE
			}
			transcendenceSocket.emit('socket/statusChange', statusUpdate); // Emit the status change to the socket
		}
	}, [addToken, currentUser.id, transcendenceSocket.id])

	useEffect(() => {
		if (userPatchError) {
			console.error('Error updating user:', userPatchError);
		}
		if (addTokenError) {
			console.error('Error adding token:', addTokenError);
		}
	}, [userPatchError, addTokenError]);

	// Function to update the user's online status
	const setUserStatusToOnline = async () => {
		if (!currentUser.id || transcendenceSocket.id == undefined) return;
		console.log(`updating user status to online in setUserStatusToOnline function in contextprovider`);
		const patchUserData: UpdateUserDto = {
			online: OnlineStatus.ONLINE,
		}
		const addTokenData: CreateTokenDto = {
			token: transcendenceSocket.id,
			userId: currentUser.id
		}
		patchUserFetcher({ url: constants.API_USERS + currentUser.id, fetchMethod: 'PATCH', payload: patchUserData });
		addTokenFetcher({ url: constants.API_ADD_TOKEN, fetchMethod: 'POST', payload: addTokenData }); //Albert: Can the transcendenceSocket.id change while the addTokenFetcher is updating the token in the backend? Should the backend give back a WebsocketStatusChangeDto? - Jorien
	};

	useEffect(() => {
		if (user != null) {
			console.log(`user changed in useAuthentication. new id: ${user.id}`);
			setCurrentUser(user);
		}
	}, [user]);

	return (
		<>
			<TranscendenceContext.Provider value={contextValues}>
				{(currentUser.id != null || pathname == '/login' || pathname == '/signup' || pathname == '/auth')? <>{children}</> : <p>Authenticating...</p>}
			</TranscendenceContext.Provider>
		</>
	)
}
