import { useContext, useEffect } from 'react';
import { UserProfileDto } from '@ft_dto/users';
import { constants } from '@ft_global/constants.globalvar';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import useFetch from '@ft_global/functionComponents/useFetch';
import SignUp from 'src/globals/layoutComponents/Login/SignUp';
import ChooseUser from 'src/globals/layoutComponents/Login/ChooseUser';
import Seed from 'src/app/dev/test/components/Seed'; //todo: this is tmp, remove later
import Auth42Button from './Auth42Button';

// import setUser from '../../functionComponents/SetUser';
import { FontBangers } from '../Font';
import CheckAlreadyLoggedIn from './CheckAlreadyLoggedIn';

function userIsSet(idFromSession: number) : boolean {
	const {currentUser} = useContext(TranscendenceContext);

	if (currentUser != null && idFromSession == currentUser.id)
		return true;
	return false;
}

export default function Login() : JSX.Element { 
	const { data: users, isLoading: usersLoading, error: usersError, fetcher: usersFetcher } = useFetch<null, UserProfileDto[]>(); //todo: remove later
	// const { data: user, fetcher: userFetcher } = useFetch<null, UserProfileDto>();
	// const idFromSession = sessionStorage.getItem('userId');
	// const searchParams = useSearchParams();
	// const code = searchParams.get('code');
	// const {currentUser, setCurrentUser} = useContext(TranscendenceContext);

	// useEffect(() => {
	// 	if (user != null)
	// 	{
	// 		setLoggedUser(user);
	// 		return ;
	// 	}
	// }, [user]);

	// const  fetchUser = async (url: string) => {
	// 	userFetcher({url: url});
	// }

	// const  setLoggedUser = async (user: UserProfileDto) => {
	// 	console.log("Setting new user with id " + user.id + " in LoginScreen");
	// 	setCurrentUser(user);
	// 	sessionStorage.setItem('userId', JSON.stringify(user.id));
	// }

	useEffect (() => {
		// if (idFromSession != null)
		// {
		// 	console.log("User already logged in. Id: " + idFromSession);
		// 	if (Object.keys(currentUser).length == 0)
		// 	{
		// 		console.log("fetching user with id: " + idFromSession);
		// 		fetchUser(constants.API_USERS + +idFromSession);
		// 	}
		// 	return ;
		// }
		// else if (code != null)
		// {
		// 	console.log("User logged in with auth42. Code: " + code);
		// 	fetchUser(constants.API_AUTH42 + code);
		// 	return ;
		// }
		// else 
		{
			fetchUsers();
		}
	}, []);

	const fetchUsers = async () => {
		console.log("fetching users in Login");
		await usersFetcher({url: constants.API_ALL_USERS});
	}

	return (
		<>
			<div className="content-area">
				<div className="col col-6 login">
					<FontBangers>
						<h1>STRONGPONG</h1>
						<p>Play pong and build stronger relationships</p>
					</FontBangers>
				</div>
				{/* <div className="col col-6 login">
					<Auth42Button />
				</div> */}

				{/* todo jma: add 3 buttons for login options */}
			{/* <div className="col login"> */}

			{/* </div> */}
				{usersLoading && <p>Loading...</p>}
				{usersError && <p>Error: {usersError.message}</p>}
				{users != null && users.length == 0 && 
					<div className="page">
						<p>Database is empty. Will be seeded now. <b>Please refresh after seeding</b></p>
						<Seed />
					</div>
				}
				{users != null && users.length > 0 && 
					<>
						<CheckAlreadyLoggedIn />
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