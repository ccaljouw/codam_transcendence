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
    loginName: string,
    password: string,
    token: string,
}

export default function Login() : JSX.Element {
  const pathname = usePathname();
	const {setCurrentUser} = useContext(TranscendenceContext);
  let {data: loggedUser, isLoading, error, fetcher} = useFetch<LoginCredentials, { user: UserProfileDto; jwt: string }>();

  useEffect(() => {
    if (loggedUser != null) {
      setLoggedUser(loggedUser.user, loggedUser.jwt);
    }
  }, [loggedUser]);

	const setLoggedUser = (user: UserProfileDto, jwt: string) => {
		console.log("Setting new user with id " + user.id + " in ChooseUser");
		setCurrentUser(user);
		sessionStorage.setItem('userId', JSON.stringify(user.id));
    sessionStorage.setItem('jwt', jwt);
	}

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const payload = e.target as typeof e.target & {
          loginName: { value: string };
          password: { value: string };
          token: { value: string };
        };
        console.log(`interpreted form: ${payload.loginName.value}, ${payload.password.value}, ${payload.token.value}`)
        await fetcher({
          url:`${constants.API_LOGIN}`, 
          fetchMethod: 'POST', 
          payload: { loginName: payload.loginName.value, password: payload.password.value, token: payload.token.value }
        });
    }

	return (
		<>
			<div className="white-box">
				<H3 text="Login to play some pong"></H3>
        <form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
            <input id="loginName" type="loginName" required={true} className="form-control form-control-sm" placeholder={"loginName"}></input>
            <input id="password" type="password" required={true} className="form-control form-control-sm" placeholder={"password"}></input>
            <input id="token" type="token" required={true} className="form-control form-control-sm" placeholder={"token"}></input>
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
