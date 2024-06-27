"use client";
import { FormEvent, useContext, useEffect } from 'react';
import { UserProfileDto } from '@ft_dto/users';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { constants } from '@ft_global/constants.globalvar'
import { H3 } from 'src/globals/layoutComponents/Font';
import useFetch from 'src/globals/functionComponents/useFetch';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type LoginCredentials = {
    email: string,
    password: string
}

export default function Login() : JSX.Element {
  const pathname = usePathname();
	const {setCurrentUser} = useContext(TranscendenceContext);
    const {data: loggedUser, isLoading, error, fetcher} = useFetch<LoginCredentials, UserProfileDto>();

    useEffect(() => {
      if (loggedUser != null)
        setLoggedUser(loggedUser);
    }, [loggedUser]);

    useEffect(() => {
      console.log(`Logging in from: ${pathname}`);
    }, []);

	const setLoggedUser = (user: UserProfileDto) => {
		console.log("Setting new user with id " + user.id + " in ChooseUser");
		setCurrentUser(user);
		sessionStorage.setItem('userId', JSON.stringify(user.id));
	}

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Logging in user 1 in Login");
        await fetcher({url:`${constants.API_USERS}1`});
    }

	return (
		<>
			<div className="white-box">
				<H3 text="Login to play some pong"></H3>
                <form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
                    <input id="email" type="email" required={true} className="form-control form-control-sm" placeholder={"email"}></input>
                    <input id="password" type="password" required={true} className="form-control form-control-sm" placeholder={"password"}></input>
                    <button className="btn btn-dark btn-sm" type="submit">Login</button>
                </form>
			</div>
      <div className="white-box">
        <Link className="btn btn-dark btn-block" href={`${constants.API_AUTH42}`}>
          Or continue with Auth42
        </Link>
      </div>
		</>
	);
}
