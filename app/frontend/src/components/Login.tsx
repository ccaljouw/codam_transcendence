import { useContext, useEffect, useState } from 'react';
import ChooseUser from 'src/app/sign-up/components/ChooseUser';
import Seed from 'src/app/test/components/Seed';
import { constants } from '../globals/constants.globalvar'
import SignUp from 'src/app/sign-up/components/SignUp';
import useFetch from './useFetch';
import { UserProfileDto } from '../../../backend/src/users/dto/user-profile.dto';
import { TranscendenceContext } from 'src/globals/contextprovider.globalvar';

export default function Login() : JSX.Element { 
	const { data: users, isLoading, error, fetcher } = useFetch<null, UserProfileDto[]>();
	const {currentUser, setCurrentUser} = useContext(TranscendenceContext);

	useEffect (() => {
		const idFromSession = sessionStorage.getItem('userId');
		const nameFromSession = sessionStorage.getItem('userName');
	
		if (idFromSession != null && +idFromSession != currentUser.id)
		{
			setCurrentUser({...currentUser, id: +idFromSession});
			if (nameFromSession != null && nameFromSession != currentUser.userName)
				setCurrentUser({...currentUser, userName: nameFromSession});
			return ;
		} else {
			fetchUsers();
		}
	}, [currentUser]);

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
						<ChooseUser />
					</div>
					<div className="col">
						<SignUp />
					</div></>
				}
			</div>
		</>
	);
}
