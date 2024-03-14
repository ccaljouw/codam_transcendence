import { useContext, useEffect } from 'react';
import { UserProfileDto } from '@dto/users';
import { TranscendenceContext, constants } from '@global/vars';
import useFetch from './useFetch';
import ChooseUser from 'src/app/sign-up/components/ChooseUser';
import Seed from 'src/app/test/components/Seed';
import SignUp from 'src/app/sign-up/components/SignUp';

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
