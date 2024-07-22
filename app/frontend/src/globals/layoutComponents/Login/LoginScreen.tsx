import { useEffect, useState } from 'react';
import { UserProfileDto } from '@ft_dto/users';
import { constants } from '@ft_global/constants.globalvar';
import useFetch from '@ft_global/functionComponents/useFetch';
import SignUp from 'src/globals/layoutComponents/Login/SignUp';
import ChooseUser from 'src/globals/layoutComponents/Login/ChooseUser';
import Seed from 'src/app/dev/test/components/Seed'; //todo: this is tmp, remove later
import { FontBangers, H3 } from '../Font';
import Login from './Login';

function LoginOptions() : JSX.Element {
	const { data: users, isLoading: usersLoading, error: usersError, fetcher: usersFetcher } = useFetch<null, UserProfileDto[]>(); //todo: remove later
	const [loginOption, setLoginOption] = useState<string>("choose"); //todo: JMA: change to login

	useEffect (() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		console.log("fetching users in Login");
		await usersFetcher({url: constants.API_ALL_USERS});
	}

	//todo: JMA: remove this option in the end
	const handleChooseClick = () => {
		setLoginOption("choose")
	}

	const handleLoginClick = () => {
		setLoginOption("login")
	}

	const handleSignUpClick = () => {
		setLoginOption("signUp")
	}

	return (
		<>
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
					<div className="col col-8 mt-0 index-middle">
						<div className="row">
							<div className="btn-group p-0" role="group">
								{/* <button type="button" className={`btn btn-dark ${loginOption == "choose" ? "active" : ""}`} onClick={handleChooseClick}>Choose user from list</button> */}
								<button type="button" className={`btn btn-dark ${loginOption == "login" ? "active" : ""}`} onClick={handleLoginClick}>Login</button>
								<button type="button" className={`btn btn-dark ${loginOption == "signUp" ? "active" : ""}`} onClick={handleSignUpClick}>Create new account</button>
							</div>
						</div>
							{/* {loginOption == "choose" && <ChooseUser />} */}
							{loginOption == "login" && <Login />}
							{loginOption == "signUp" && <SignUp />}
					</div>
				</>
			}
		</>
	);
}

export default function LoginScreen() : JSX.Element { 
	return (
		<>
			<div className="content-area">
				<div className="col col-3 mt-0 index-left">
					<FontBangers>
						<h1>STRONGPONG</h1>
						<p>Play pong and build stronger relationships</p>
					</FontBangers>
				</div>
				<div className="col col-9 mt-0">
					<div className="row">
						<LoginOptions />
					</div>
				</div>
				
			</div>
		</>
	);
}