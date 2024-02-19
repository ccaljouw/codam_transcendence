import { useEffect, useRef, useState } from "react"
import { UserProfileDto } from '../../../backend/src/users/dto/user-profile.dto'
import { constants } from '../globals/constants.globalvar'

/**
 * 
 * @param  userDisplayFunction (function(UserProfileDto) => JSX.Element): pointer to function to make the list items with
 * @param filterUserIds (number[]): array with userids to filter the whole list with
 * @param includeFilteredUserIds (bool): true if the array of filtered users should be the only one shown, false if they are the only ones to not show
 * @returns 
 */
const UserList = ({ userDisplayFunction, filterUserIds, includeFilteredUserIds = false }: { userDisplayFunction: (user: UserProfileDto) => JSX.Element; filterUserIds?: number[]; includeFilteredUserIds?: boolean; }) => {
	const [userListFromDb, setUserListFromDb] = useState([]);
	const [processedUserList, setProcessedUserList] = useState([]);
	const firstRender = useRef(true);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			fetchUsers();
		}


	}, []);

	useEffect(() => {
		if (userListFromDb.length == 0)
			return;
		let filtered;
		if (filterUserIds && filterUserIds.length > 0) {
			if (includeFilteredUserIds)
				filtered = userListFromDb.filter((user: { id: number }) => filterUserIds.includes(user.id));
			else
				filtered = userListFromDb.filter((user: { id: number }) => !filterUserIds.includes(user.id));
		} else
			filtered = userListFromDb;
		setProcessedUserList(filtered);

	}, [userListFromDb, filterUserIds, includeFilteredUserIds])

	async function fetchUsers() {
		try {
			const response = await fetch(constants.API_ALL_USERS);
			if (!response.ok) {
				throw new Error('Failed to fetch users');
			}
			const data = await response.json();
			setUserListFromDb(data);
		} catch (error) {
			console.error(error);
		}
	}
	return (
		<div className='component userlist'>
			<ul>
				{processedUserList.map(userDisplayFunction)}
			</ul>
		</div>
	);
}


export default UserList