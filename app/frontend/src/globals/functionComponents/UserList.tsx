import { useEffect, useState, createContext } from "react"
import { UserProfileDto } from '@ft_dto/users'
import useFetch from "./useFetch";
import { OnlineStatus } from "@prisma/client";

interface UserListProps {
	userDisplayFunction: (user: UserProfileDto, indexInUserList: number, statusChangeCallback: (idx: number, newStatus? : OnlineStatus) => void) => JSX.Element;
	fetchUrl: string;
}

interface UserListContextVars {
	// todo: change statusChangeCallback to context useState
	contextMenuClickSent: number;
	triggerContextMenuClick: (val: number) => void;
}
export const UserListContext = createContext<UserListContextVars>({
	contextMenuClickSent: 0,
	triggerContextMenuClick: () => { }
});

/**
 * 
 * @param props userDisplayFunction: function to display a user, userFetcherFunction: function to fetch users
 * @returns JSX.Element
 */
export default function UserList(props: UserListProps): JSX.Element {
	const [userList, setUserlist] = useState<UserProfileDto[]>([]);
	const [contextMenuClickSent, triggerContextMenuClick] = useState<number>(0);
	const {data: usersFromDb, isLoading: usersFromDbLoading, error: userFromDbError, fetcher: usersFromDbFetcher} = useFetch<null, UserProfileDto[]>();

	// fetch users on mount
	useEffect(() => {
		fetchUsers();
	}, []);

	useEffect(() => { // update userlist when usersFromDb is fetched
		if (usersFromDb != null) {
			setUserlist(usersFromDb);
		}
	}, [usersFromDb]);

	const fetchUsers = async () => {
		await usersFromDbFetcher({url: props.fetchUrl});
	}

	const moveItemWithIdToTop = (idx: number) : void => {
		const updatedList = [...userList];
		const item = updatedList.splice(idx, 1)[0];
		updatedList.unshift(item);
		setUserlist(updatedList);
	}

	const statusChangeCallback = (idx: number, newStatus?: OnlineStatus) : void => {
		if (newStatus !== undefined)
			userList[idx].online = newStatus;
		if (newStatus === undefined || newStatus !== OnlineStatus.OFFLINE)
			moveItemWithIdToTop(idx);
	}

	return (
		<>
			<UserListContext.Provider value={{contextMenuClickSent, triggerContextMenuClick}}> 
				<div className='userlist text-start'>
					{usersFromDbLoading && <p>Loading users...</p>}
					{userFromDbError && <p>Error: {userFromDbError.message}</p>}
					{userList != null && <ul>{userList.map((entry, index) => (props.userDisplayFunction(entry, index, statusChangeCallback)))}</ul>}
				</div>
			</UserListContext.Provider>
		</>
	);
}
