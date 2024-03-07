"use client";
import { useState } from 'react';
import FormInput from '../../../components/FormInput';

async function PostNewUser(formData: FormData) {
	
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(Object.fromEntries(formData))
	};
	console.log(requestOptions);
	try {
		const response = await fetch('http://localhost:3001/users/register', requestOptions);
		const id = await response?.json();
		console.log(response);
		console.log(id);
		sessionStorage.setItem("userId", id); // todo: change this to easily store token
		if (!response?.ok)
			return ("Error creating new user: " + response.status + ": " + response.statusText + ": " + id.message); // messages coherent
		return ("Succesfully created new user: " + String(id));
	} catch (error) {
		console.error(error);
	}
	return ("Error: API path not recognized")
}

export default function SignUp({setCurrentUserId} : {setCurrentUserId: any}) { //todo: find correct type
	const [message, setMessage] = useState<string | null>("");

	async function handleSubmit(formData: FormData) {
		setMessage(await PostNewUser(formData));
		setCurrentUserId(message); //todo: don't do this when error returned
		//todo: set userName as well
	}

	return (
		<>
			<form action={handleSubmit}>
				<h1>Sign up to play</h1>
				<FormInput types="text" text="First Name" theName="firstName"/>
				<FormInput types="text" text="Last Name" theName="lastName"/>
				<FormInput types="text" text="Username" theName="userName"/>
				<FormInput types="email" text="Email address" theName="email"/>
				<FormInput types="text" text="Login name" theName="loginName"/>
				<FormInput types="text" text="Password" theName="hash"/>	
				<button className="btn btn-dark w-10 py-2 mt-3" type="submit" >Sign up</button>
			</form>
			<p>{message}</p>
		</>
	);
}
