import { useEffect, useState } from 'react';
import ChooseUser from 'src/app/sign-up/components/ChooseUser';
import Seed from 'src/app/test/components/Seed';
import { constants } from '../globals/constants.globalvar'

export default function Login({ currentUserId, setCurrentUserId, currentUserName, setCurrentUserName } : { currentUserId: number, setCurrentUserId: any, currentUserName: string, setCurrentUserName: any }) { //todo: change type
	const [userListFromDb, setUserListFromDb] = useState([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect (() => {
		const id = sessionStorage.getItem('userId');
		const name = sessionStorage.getItem('userName');
	
		if (id != null && +id != currentUserId)
		{
			setCurrentUserId(+id);
			if (name != null && name != currentUserName)
				setCurrentUserName(name);
			return ;
		} else {
			fetchUsers();
		}
		setIsLoading(false);
	}, []);

	async function fetchUsers() {
		console.log("fetching users");
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

	if (isLoading)
		return (<></>);
	
	if (userListFromDb.length == 0)
	{
		return (
			<>
				<div className="page">
				<p>Database is empty. Will be seeded now. <b>Please refresh after seeding</b></p>
				<Seed />
				</div>
			</>
		);
	}

	return (
		<>
			<div className="page">
				<h1>Log in or sign up to play pong</h1>
				<ChooseUser setCurrentUserId={setCurrentUserId} setCurrentUserName={setCurrentUserName}/>
			</div>
		</>
	);
}
