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

interface BikeValues {
    value: number;
}

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
	firstBike: BikeValues;
	secondBike: BikeValues;
	setFirstBike: (val: number) => void;
	setSecondBike: (val: number) => void;
	connectToESP8266: (updateCallBack: Function) => Promise<void>;
	subscribeToBikeUpdates: (callback: (firstBike: BikeValues, secondBike: BikeValues) => void) => void;

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
	firstBike: {value: 0},
	secondBike: {value: 0},
	setFirstBike: () => { },
	setSecondBike: () => { },
	connectToESP8266: async () => { },
	subscribeToBikeUpdates: () => { },
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
	const [socketId, setSocketId] = useState<string>('');
	const { user } = useAuthentication();
	const pathname = usePathname();
	const [allUsersUnreadCounter, setAllUsersUnreadCounter] = useState<number>(0);
	const [friendsUnreadCounter, setFriendsUnreadCounter] = useState(0);
	const { data: userPatch, isLoading: userPatchLoading, error: userPatchError, fetcher: patchUserFetcher } = useFetch<UpdateUserDto, UserProfileDto>();
	const { data: addToken, isLoading: addTokenLoading, error: addTokenError, fetcher: addTokenFetcher } = useFetch<CreateTokenDto, boolean>();
	const { data: unreadMessageCount, isLoading: unreadMessageCountLoading, error: unreadMessageCountError, fetcher: unreadMessageCountFetcher } = useFetch<null, number>();
	const { data: unreadsFromFriends, isLoading: unreadsFromFriendsLoading, error: unreadsFromFriendsError, fetcher: unreadsFromFriendsFetcher } = useFetch<number, number>();
	const firstBikeRef = useRef<BikeValues>({ value: 0 });
    const secondBikeRef = useRef<BikeValues>({ value: 0 });
	const [firstBike, setFirstBike] = useState<number>(0);
	const [secondBike, setSecondBike] = useState<number>(0);
	const [switchToChannelCounter, setSwitchToChannelCounter] = useState({ channel: -1, count: 0, invite: -1 });

    const subscribers = useRef<Function[]>([]);	

    const notifySubscribers = () => {
        subscribers.current.forEach(callback => callback(firstBikeRef.current.value, secondBikeRef.current.value));
    };

    useEffect(() => {
        notifySubscribers();
    }, [firstBike, secondBike]);

    const subscribeToBikeUpdates = (callback: (firstBike: BikeValues, secondBike: BikeValues) => void) => {
        subscribers.current.push(callback);
        return () => {
            subscribers.current = subscribers.current.filter(cb => cb !== callback);
        };
    };
	const connectToESP8266 = async (updateCallBack: Function) => {
		//todo: consider changing this: The line below makes the code ignore the navigator.serial warning
		//@ts-ignore
		const serial = navigator.serial as Serial;
		if (!serial) {
			console.log("Only available in Chrome");
			return;
		}
		try {
			// Request access to the serial port
			const port = await serial.requestPort();
			await port.open({ baudRate: 9600 });

			// Start reading data from the serial port
			const reader = port.readable.getReader();
			let buffer = ''; // Initialize buffer to store incoming data

			while (true) {
				const { value, done } = await reader.read();
				if (done) break;
				// Append incoming data to the buffer
				buffer += new TextDecoder().decode(value);

				// Process complete lines from the buffer
				let lines = buffer.split('\n');
				// The last element may be incomplete, so keep it in the buffer
				buffer = lines.pop() || '';

				for (let line of lines) {
					if (line.trim() !== '') {
						// Process the complete line (e.g., update the webpage)
						updateCallBack(line.trim());
					}
				}
			}
			// If there's any remaining data in the buffer, process it
			if (buffer.trim() !== '') {
				updateCallBack(buffer.trim());
			}
		} catch (error) {
			console.error('Serial port error:', error);
		}
	};
	


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

		// Listener for when the socket connects: update the user's status to online
		transcendenceSocket.on('connect', () => {
			console.log('Socket connected');
			if (transcendenceSocket.id != undefined) 
				setSocketId(transcendenceSocket.id);
			setUserStatusToOnline();
		});

		return () => { // Cleanup socket listener
			transcendenceSocket.off('socket/statusChange');
			transcendenceSocket.off('chat/messageToUserNotInRoom');
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

		}else{
			console.log("Currentuser.id/transcendencsesocket.id userEffect called but no socket.id or currentUser.id", transcendenceSocket.id, currentUser.id);
		}
	}, [currentUser.id, socketId]);

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

    const handleSetFirstBike = (val: number) => {
        firstBikeRef.current.value = val;
        setFirstBike(val);
        notifySubscribers();
    };

    const handleSetSecondBike = (val: number) => {
        secondBikeRef.current.value = val;
        setSecondBike(val);
        notifySubscribers();
    };

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
		firstBike: firstBikeRef.current,
		secondBike: secondBikeRef.current,
		setFirstBike: handleSetFirstBike,
		setSecondBike: handleSetSecondBike,
		connectToESP8266,
		subscribeToBikeUpdates,
		switchToChannelCounter,
		setSwitchToChannelCounter
	};

	useEffect(() => {
		if (userPatch) {
			console.log(`userPatch will be saved as currentUser with id: ${userPatch.id}`);
			setCurrentUser(userPatch);
		}
	}, [userPatch]);

	useEffect(() => {
		console.log(`addToken useEffect in contextprovider`);
		if (addToken) {
			console.log(`updating usertoken in addToken useEffect in contextprovider`);
			const statusUpdate: WebsocketStatusChangeDto = {
				userId: currentUser.id,
				userName: currentUser.userName,
				token: (transcendenceSocket.id ? transcendenceSocket.id : ''),
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
		if (!currentUser.id || transcendenceSocket.id == undefined)
		{
			console.log(`currentUser.id or transcendenceSocket.id is undefined in setUserStatusToOnline function in contextprovider`, currentUser.id, transcendenceSocket.id);
			return;
		}
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


	
   // Update the state when the ref value changes
   useEffect(() => {
	console.log("Subscribing to bike updates");
	const updateBikeValues = () => {
		console.log("firstBike.current.value: ", firstBikeRef.current.value, "secondBike.current.value: ", secondBikeRef.current.value);
		setFirstBike(firstBikeRef.current.value);
		setSecondBike(secondBikeRef.current.value);
	};
	
	const unsubscribe = subscribeToBikeUpdates(updateBikeValues);
	
	return () => unsubscribe();
}, [subscribeToBikeUpdates]);

	return (
		<>
			<TranscendenceContext.Provider value={contextValues}>
				{(currentUser.id != null || pathname == '/login' || pathname == '/signup' || pathname == '/auth')? <>{children}</> 
				: <div className="text-center white-box navbar"><p>Authenticating...</p></div>}
			</TranscendenceContext.Provider>
		</>
	)
}
