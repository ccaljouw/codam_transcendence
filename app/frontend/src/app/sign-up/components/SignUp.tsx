"use client";
import { FormEvent, useEffect, useContext } from 'react';
import FormInput from '../../../components/FormInput';
import useFetch from 'src/components/useFetch';
import { UserProfileDto } from '../../../../../backend/src/users/dto/user-profile.dto';
import { TranscendenceContext } from 'src/globals/contextprovider.globalvar';

export default function SignUp(): JSX.Element {
	const { data: user, isLoading, error, fetcher } = useFetch<Object, UserProfileDto>();
    const { setCurrentUserId, setCurrentUserName } = useContext(TranscendenceContext);

	useEffect(() => {
		console.log("user changed");
		if (user != null)
		{
			sessionStorage.setItem('userId', JSON.stringify(user.id));
			sessionStorage.setItem('userName', JSON.stringify(user.userName));
			sessionStorage.setItem('loginName', JSON.stringify(user.loginName));
			setCurrentUserId(user.id);
			setCurrentUserName(user.userName);
			//todo: change contextProvider variables
		}
	}, [user])

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		console.log("FormData: " + JSON.stringify(Object.fromEntries(formData)));
		await fetcher({
			url: 'http://localhost:3001/users/register', //todo: change to constant url
			fetchMethod: 'POST', 
			payload: Object.fromEntries(formData),
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
