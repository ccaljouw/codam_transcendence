"use client";
import { FormEvent } from 'react';
import FormInput from '../../../components/FormInput';
import useFetch from 'src/components/useFetch';

export default function SignUp(): JSX.Element {
	const { data: userId, isLoading, error, fetcher } = useFetch<Object, number>();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		console.log("FormData: " + JSON.stringify(Object.fromEntries(formData)));
		await fetcher({
			url: 'http://localhost:3001/users/register', 
			fetchMethod: 'POST', 
			payload: Object.fromEntries(formData),
		});
		if (userId != null)
		{
			sessionStorage.setItem('userId', JSON.stringify(userId));
			//todo: update user in contextprovider
			// setCurrentUserId(userId);
			// sessionStorare.setItem('userName', formData.get(userName));
			// setCurrentUserName();
		}
	}

	return (
		<>
			
			{isLoading && <p>Sending info to database...</p>}
			{error && <p>Error: {error.message}</p>}
			{userId? <p>User created with id {userId}</p> : 
				<form onSubmit={handleSubmit}>
				<h1>Sign up to play</h1>
				<FormInput types="text" text="First Name" theName="firstName"/>
				<FormInput types="text" text="Last Name" theName="lastName"/>
				<FormInput types="text" text="Username" theName="userName"/>
				<FormInput types="email" text="Email address" theName="email"/>
				<FormInput types="text" text="Login name" theName="loginName"/>
				<FormInput types="text" text="Password" theName="hash"/>	
				<button className="btn btn-dark w-10 py-2 mt-3" type="submit" >Sign up</button>
				</form>
			}
		</>
	);
}
