"use client";
import { FormEvent, useEffect, useState } from 'react';
import { UserProfileDto } from '@ft_dto/users';
import { constants } from '@ft_global/constants.globalvar'
import { H3 } from 'src/globals/layoutComponents/Font';
import useFetch from 'src/globals/functionComponents/useFetch';
import { useRouter } from 'next/navigation';
import useAuthentication from 'src/globals/functionComponents/useAuthentication';
import Seed from 'src/app/(general)/dev/test/components/Seed';

type LoginCredentials = {
	loginName: string,
	password: string,
	token?: string,
}

export default function Login() : JSX.Element {
	const {data: loggedUser, isLoading, error, fetcher} = useFetch<LoginCredentials, UserProfileDto>();
	const {storeUser} = useAuthentication();
    const { data: users, isLoading: usersLoading, error: usersError, fetcher: usersFetcher } = useFetch<null, UserProfileDto[]>(); //todo: remove later

	//todo: remove
	useEffect (() => {
		if (users == null)
			fetchUsers();
		else if (users.length == 0)
            console.log("No users in database, seed should be triggered");
	}, [users]);

	//todo: remove
	const fetchUsers = async () => {
		console.log("fetching users in Login");
		await usersFetcher({url: constants.API_ALL_USERS});
	}

	useEffect(() => {
		if (loggedUser != null) {
			console.log("Setting new user with id " + loggedUser.id + " in Login");
			storeUser(loggedUser);
		}
	}, [loggedUser]);

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
					<input id="token" type="token" required={false} className="form-control form-control-sm" placeholder={"include token if 2FA enabled"}></input>
					<button className="btn btn-dark btn-sm" type="submit">{isLoading? "Logging in user" : "Login"}</button>
				</form>
				{error && <p>Login error: {error.message}</p>}
			</div>			
            {(users != null && users.length == 0) && <div className="white-box"><Seed/></div>}
		</>
	);
}
