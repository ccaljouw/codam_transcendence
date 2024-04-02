import { useEffect, useState } from "react"
import { UserProfileDto } from '@ft_dto/users'
import useFetch from "./useFetch";

interface UserListProps {
	userDisplayFunction: (user: UserProfileDto, indexInUserList: number, statusChangeCallback: (idx: number) => void) => JSX.Element;
	fetchUrl: string;
}

/**
 * 
 * @param props userDisplayFunction: function to display a user, userFetcherFunction: function to fetch users
 * @returns JSX.Element
 */
export default function UserList(props: UserListProps): JSX.Element {
	const [userList, setUserlist] = useState<UserProfileDto[]>([]);
	const {data: usersFromDb, isLoading: usersFromDbLoading, error: userFromDbError, fetcher: usersFromDbFetcher} = useFetch<null, UserProfileDto[]>();

	// fetch users on mount
	useEffect(() => {
		fetchUsers();
	}, []);

	useEffect(() => { // update userlist when usersFromDb is fetched
		if (usersFromDb) {
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

	return (
		<div className='userlist text-start'>
			{usersFromDbLoading && <p>Loading users...</p>}
			{userFromDbError && <p>Error: {userFromDbError.message}</p>}
			{userList && <ul>{userList.map((entry, index) => (props.userDisplayFunction(entry, index, moveItemWithIdToTop)))}</ul>}
		</div>
	);
}
