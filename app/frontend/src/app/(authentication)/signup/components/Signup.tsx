"use client";
import { FormEvent, useEffect } from 'react';
import { RegisterUserDto, UserProfileDto } from '@ft_dto/users';
import { constants } from '@ft_global/constants.globalvar'
import { H3 } from 'src/globals/layoutComponents/Font';
import useFetch from 'src/globals/functionComponents/useFetch';
import FormToCreateUserDto from 'src/globals/functionComponents/form/FormToCreateUserDto';
import useAuthentication from 'src/globals/functionComponents/useAuthentication';
import { useRouter } from 'next/navigation';

export default function Signup() : JSX.Element {
	const {storeUser} = useAuthentication();
	const {data: loggedUser, isLoading, error, fetcher} = useFetch<RegisterUserDto, UserProfileDto>();
	const router = useRouter();

	useEffect(() => {
		if (loggedUser != null)
		{
			console.log("Setting new user with id " + loggedUser.id + " in ChooseUser");
			storeUser(loggedUser);
			router.push('/');
		}
	}, [loggedUser]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const newUser: RegisterUserDto = FormToCreateUserDto(event);
		console.log('Registering new user with data:');
		console.log(newUser);
		
		try {
			await fetcher({
				url: constants.API_REGISTER,
				fetchMethod: 'POST',
				payload: newUser
			});
		} catch (error) {
			console.error('Registration failed:', error);
			throw error;
		}
	}

	return (
		<>
			<div className="white-box">
				<H3 text="Register to play some pong"></H3>
					<form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
						<input id="firstName" type="text" required={true} className="form-control form-control-sm" placeholder={"firstName"} minLength={1} maxLength={15}></input>
						<input id="lastName" type="text" required={true} className="form-control form-control-sm" placeholder={"lastName"} minLength={1} maxLength={15}></input>
						<input id="userName" type="text" required={true} className="form-control form-control-sm" placeholder={"userName"} minLength={4} maxLength={15}></input>
						<input id="loginName" type="text" required={true} className="form-control form-control-sm" placeholder={"loginName"} minLength={4} maxLength={15}></input>
						<input id="email" type="email" required={true} className="form-control form-control-sm" placeholder={"email"}></input>
						<input id="password" type="password" required={true} className="form-control form-control-sm" placeholder={"password"} minLength={10} maxLength={50}></input>
						<button className="btn btn-dark btn-sm" type="submit">{isLoading? "Signing up user" : "Sign Up"}</button>
					</form>
			</div>
			{error && <p>Error: {error.message}</p>}
		</>
	);
}
