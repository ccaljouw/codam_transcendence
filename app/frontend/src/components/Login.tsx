import { useEffect, useState } from 'react';
import ChooseUser from 'src/app/sign-up/components/ChooseUser';
import Seed from 'src/app/test/components/Seed';
import { constants } from '../globals/constants.globalvar'
import SignUp from 'src/app/sign-up/components/SignUp';
import useFetch from './useFetch';
import { UserProfileDto } from '../../../backend/src/users/dto/user-profile.dto';

export default function Login({ currentUserId, setCurrentUserId, currentUserName, setCurrentUserName } : { currentUserId: number, setCurrentUserId: any, currentUserName: string, setCurrentUserName: any }) { //todo: change type
	const { data: users, isLoading, error, fetcher } = useFetch<null, UserProfileDto[]>();


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
	}, []);

	const fetchUsers = async () => {
		console.log("fetching users in Login");
		await fetcher({url:constants.API_ALL_USERS});
	}

	return (
		<>
			<div className="content-area">
				{isLoading && <p>Loading...</p>}
				{error && <p>Error: {error.message}</p>}
				{users != null && users.length == 0 && 
					<div className="page">
						<p>Database is empty. Will be seeded now. <b>Please refresh after seeding</b></p>
						<Seed />
					</div>
				}
				{users != null && users.length > 0 && <>
					<div className="col">
						<ChooseUser setCurrentUserId={setCurrentUserId} setCurrentUserName={setCurrentUserName}/>
					</div>
					<div className="col">
						<SignUp />
					</div></>
				}
			</div>
		</>
	);
}
