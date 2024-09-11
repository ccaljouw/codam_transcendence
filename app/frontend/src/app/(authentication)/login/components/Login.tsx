"use client";
import { FormEvent, useEffect, useState } from 'react';
import { UserProfileDto } from '@ft_dto/users';
import { constants } from '@ft_global/constants.globalvar'
import { H3 } from 'src/globals/layoutComponents/Font';
import useFetch from 'src/globals/functionComponents/useFetch';
import useAuthentication from 'src/globals/functionComponents/useAuthentication';

type LoginCredentials = {
	loginName: string,
	password: string,
	token?: string,
}

export default function Login() : JSX.Element {
	const {data: loggedUser, isLoading, error, fetcher} = useFetch<LoginCredentials, UserProfileDto>();
	const {storeUser} = useAuthentication();
	const [tokenRequestVisible, setTokenRequestVisible] = useState<boolean>(false);

	useEffect(() => {
		if (loggedUser != null) {
			console.log("Setting new user with id " + loggedUser.id + " in Login");
			storeUser(loggedUser);
		}
	}, [loggedUser]);

	useEffect(() => {
		if (error != null && (error.message == '401 - 2FA token is required' || error.message == '401 - Token verification failed: invalid token')) 
		{
			setTokenRequestVisible(true);
		}			
	}, [error]);

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
				{tokenRequestVisible == true ?
					<H3 text="Fill in 2FA token"></H3>
					:
					<H3 text="Login to play some pong"></H3>
				}
				<form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
					<input id="loginName" type={tokenRequestVisible == true ? "hidden" : "text"} required={true} className="form-control form-control-sm" placeholder={"loginName"}></input>
					<input id="password" type={tokenRequestVisible == true ? "hidden" : "password"} autoComplete="off" required={true} className="form-control form-control-sm" placeholder={"password"}></input>
					<input id="token" type={tokenRequestVisible == true ? "number" : "hidden"} autoComplete="off" required={false} className="form-control form-control-sm" placeholder={"2FA token"} minLength={6} maxLength={6}></input>
					<button className="btn btn-dark btn-sm" type="submit">{isLoading? "Logging in user" : "Login"}</button>
				</form>
				{(error && error.message != '401 - 2FA token is required') && <p>Login error: {error.message}</p>}
			</div>			
		</>
	);
}
