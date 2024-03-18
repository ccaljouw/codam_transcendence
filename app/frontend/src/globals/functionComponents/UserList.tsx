import { useEffect, useState } from "react"
import { UserProfileDto } from '@ft_dto/users'


interface UserListProps {
	userDisplayFunction: (user: UserProfileDto, indexInUserList: number, statusChangeCallback: (idx: number) => void) => JSX.Element;
	userFetcherFunction: () => Promise<UserProfileDto[]>;
}

/**
 * 
 * @param props userDisplayFunction: function to display a user, userFetcherFunction: function to fetch users
 * @returns JSX.Element
 */
export default function UserList(props: UserListProps): JSX.Element {
	const [userList, setUserlist] = useState<UserProfileDto[]>([]);
	const [error, setError] = useState<boolean>(false);

	// fetch users on mount
	useEffect(() => {
		props.userFetcherFunction().then((usersFromDb) => {
			setUserlist(usersFromDb);
		})
			.catch((error) => {
				console.error(error);
				setError(true);
			})
			;
	}, []);

	const moveItemWithIdToTop = (idx: number) : void => {
		console.log("CalleBack!!!");
		const updatedList = [...userList];
		const item = updatedList.splice(idx, 1)[0];
		updatedList.unshift(item);
		setUserlist(updatedList);
	}

	return (
		<div className='userlist'>
			{
			error ? 
			<p>Error fetching users</p> :
			<ul>{userList.map((entry, index) => (props.userDisplayFunction(entry, index, moveItemWithIdToTop)))}</ul>
			}
		</div>
	);
}
