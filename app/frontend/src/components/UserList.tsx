import { useContext, useEffect, useRef, useState } from "react"
import { UserProfileDto } from '../../../backend/src/users/dto/user-profile.dto'
import { constants } from '../globals/constants.globalvar'
import { TranscendenceContext } from "src/globals/contextprovider.globalvar"
import DataFetcherJson from "./DataFetcherJson"
import { User } from "@prisma/client"

/**
 * 
 * @param  userDisplayFunction (function(UserProfileDto) => JSX.Element): pointer to function to make the list items with
 * @param filterUserIds (number[]): array with userids to filter the whole list with
 * @param includeFilteredUserIds (bool): true if the array of filtered users should be the only one shown, false if they are the only ones to not show
 * @returns 
 */
const UserList = ({ userDisplayFunction, filterUserIds, includeFilteredUserIds = false }: { userDisplayFunction: (user: UserProfileDto) => JSX.Element; filterUserIds?: number[]; includeFilteredUserIds?: boolean; }) => {
	const [userListFromDb, setUserListFromDb] = useState<UserProfileDto[]>([]);
	const [processedUserList, setProcessedUserList] = useState<UserProfileDto[]>([]);
	const {someUserUpdatedTheirStatus} = useContext(TranscendenceContext);

	useEffect(() => {
		console.log("render userList: ");
		fetchUsers();
	}, [someUserUpdatedTheirStatus]);

	useEffect(() => {
		if (userListFromDb.length == 0)
			return ;
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

	//todo: use generic data fetcher
	async function fetchUsers() {
		console.log("fetching users");
		try {
			// const response = await fetch(constants.API_ALL_USERS);
			// if (!response.ok) {
			// 	throw new Error('Failed to fetch users');
			// }
			// const data = await response.json();
			// setUserListFromDb(data);
			const response = await DataFetcherJson({url: constants.API_ALL_USERS});
			console.log("response: ", response);
			if (response instanceof Error) {
				console.log('Failed to fetch users');
				return;
			}
			setUserListFromDb(response);
		} catch (error) {
			console.error(error);
		}
	}
	return (
		<div className='userlist'>
			<ul>
				{processedUserList.map(userDisplayFunction)}
			</ul>
		</div>
	);
}

export default UserList