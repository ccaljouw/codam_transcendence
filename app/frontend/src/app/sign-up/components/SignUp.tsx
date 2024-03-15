"use client";
import { FormEvent, useEffect, useContext } from 'react';
import { CreateUserDto, UserProfileDto } from '@dto/users';
import { TranscendenceContext } from '@global/contextprovider.globalvar';
import { constants } from '@global/constants.globalvar'
import useFetch from '@global/functionComponents/useFetch';
import FormInput from '@global/functionComponents/FormInput';

export default function SignUp(): JSX.Element {
	const { data: user, isLoading, error, fetcher } = useFetch<CreateUserDto, UserProfileDto>();
    const { setCurrentUser } = useContext(TranscendenceContext);

	useEffect(() => {
		console.log("user changed");
		if (user != null)
		{
			sessionStorage.setItem('userId', JSON.stringify(user.id));
			sessionStorage.setItem('userName', JSON.stringify(user.userName));
			sessionStorage.setItem('loginName', JSON.stringify(user.loginName)); //todo: move to context
			setCurrentUser(user);
		}
	}, [user])

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault(); //check if needed
		const formData = new FormData(event.currentTarget); // todo: we use new, should we use delete?
		const newUser: CreateUserDto = {
			firstName: (formData.get('firstName'))!.toString(),
			lastName: (formData.get('lastName'))!.toString(),
			userName: (formData.get('userName'))!.toString(),
			email: (formData.get('email'))!.toString(),
			loginName: (formData.get('loginName'))!.toString(),
			hash: (formData.get('hash'))!.toString(),	
		};
		console.log("New user: " + JSON.stringify(newUser));
		await fetcher({
			url: constants.API_REGISTER,
			fetchMethod: 'POST', 
			payload: newUser,
		});
	}

	return (
		<>
			{isLoading && <p>Sending info to database...</p>}
			{error && <p>Error: {error.message}</p>}
			{user != null && <p>User created with id {user.id}</p>}
			{user == null &&
				<form onSubmit={handleSubmit}>
				<h1>Sign up to play</h1>
				<FormInput types="text" text="First Name" theName="firstName"/>
				<FormInput types="text" text="Last Name" theName="lastName"/>
				<FormInput types="text" text="Username" theName="userName"/>
				<FormInput types="email" text="Email address" theName="email"/>
				<FormInput types="text" text="Login name" theName="loginName"/>
				<FormInput types="password" text="Password" theName="hash"/>	
				<button className="btn btn-dark w-10 py-2 mt-3" type="submit" >Sign up</button>
				</form>
			}
		</>
	);
}

//todo: JMA: add validation on form fields