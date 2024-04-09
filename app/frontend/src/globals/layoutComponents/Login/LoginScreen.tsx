import { useContext, useEffect } from 'react';
import { UserProfileDto } from '@ft_dto/users';
import { constants } from '@ft_global/constants.globalvar';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import useFetch from '@ft_global/functionComponents/useFetch';
import SignUp from 'src/globals/layoutComponents/Login/SignUp';
import ChooseUser from 'src/globals/layoutComponents/Login/ChooseUser';
import Seed from 'src/app/dev/test/components/Seed'; //todo: this is tmp, remove later
import Auth42Button from './Auth42Button';

export default function Login() : JSX.Element { 
	const { data: user, isLoading, error, fetcher: userFetcher } = useFetch<null, UserProfileDto>();
	const { data: users, isLoading: usersLoading, error: usersError, fetcher: usersFetcher } = useFetch<null, UserProfileDto[]>(); //todo: remove later
	const {currentUser, setCurrentUser} = useContext(TranscendenceContext);

	useEffect (() => {
		const idFromSession = sessionStorage.getItem('userId');

		if (idFromSession != null && +idFromSession > 0)
		{
			if (+idFromSession == currentUser.id)
			{
				return ;
			}
			else
				userFetcher({url: constants.API_USERS + +idFromSession});
		}
		else {
			fetchUsers();
		}
	}, []);

	useEffect(() => {
		console.log("user already exists in login");
		if (user != null)
		{
			setCurrentUser(user);
			return ;
		}
	}, [user]);

	const fetchUsers = async () => {
		console.log("fetching users in Login");
		await usersFetcher({url: constants.API_ALL_USERS});
	}

	return (
		<>
			<div className="content-area">
				{(isLoading || usersLoading )&& <p>Loading...</p>}
				{error && <p>Error: {error.message}</p>}
				{usersError && <p>Error: {usersError.message}</p>}
				{users != null && users.length == 0 && 
					<div className="page">
						<p>Database is empty. Will be seeded now. <b>Please refresh after seeding</b></p>
						<Seed />
					</div>
				}
				{users != null && users.length > 0 && 
					<>
						<div className="col login">
							<ChooseUser />
						</div>
						<div className="col login">
							<SignUp />
						</div>
						<div className="col login">
							<Auth42Button />
						</div>
					</>
				}			

			</div>
		</>
	);
}