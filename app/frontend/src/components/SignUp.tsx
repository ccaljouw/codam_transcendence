"use client";
import {useState} from 'react';
import FormField from './utils/FormField';

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
		sessionStorage.setItem("userId", id); // todo: change this to store token
		if (!response?.ok)
			return ("Error creating new user: " + response.status + ": " + response.statusText); // messages coherent
		return ("Succesfully created new user: " + String(id));
	} catch (error) {
		console.error(error);
	}
	return ("Error: API path not recognized")
}

export default function SignUp() {
	const [message, setMessage] = useState<string>("");
	async function handleSubmit(formData: FormData) {
		setMessage(await PostNewUser(formData));
	}
	return (
		<>
			<div className="component">
				<h1>Sign up to play</h1>
				<form className="form" action={handleSubmit}>
					<FormField label="Login name:" type="text" name="loginName"/>
					<FormField label="Password:" type="text" name="hash"/>
					<FormField label="Username:" type="text" name="userName"/>
					<FormField label="Email:" type="text" name="email"/>
					<FormField label="First name:" type="text" name="firstName"/>
					<FormField label="Last name:" type="text" name="lastName"/>
					<FormField label="Avatar ID:" type="number" name="avatarId"/>
					<FormField label="Online status:" type="number" name="online"/>
					<input type="submit" value="Submit" />
				</form>
				<p>{message}</p>
			</div>
		</>
	);
}
