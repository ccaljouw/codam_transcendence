"use client";
import {useState} from 'react';

function FormField({types, text, theName}:{types:string, text:string, theName:string}) {
	return (
		<>
			<div className="form-floating">
				<input id="floatingInput" className="form-control" type={types} name={theName}></input>
				<label htmlFor="floatingInput" >{text}</label>
			</div>
		</>
	);
}

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

export default function SignUp() {
	const [message, setMessage] = useState<string | null>("");

	async function handleSubmit(formData: FormData) {
		setMessage(await PostNewUser(formData));
	}
	return (
		<>
			<div className="component">
				<form action={handleSubmit} >
					<h1 className="mb-3">Sign up to play</h1>
					{/* The below placeholders are never visible */}
					<FormField types="text" text="First Name" theName="firstName"/>
					<FormField types="text" text="Last Name" theName="lastName"/>
					<FormField types="text" text="Username" theName="userName"/>
					<FormField types="email" text="Email address" theName="email"/>
					<FormField types="text" text="Login name" theName="loginName"/>
					<FormField types="text" text="Password" theName="hash"/>	
					<button className="btn btn-dark w-10 py-2 mt-3" type="submit" >Sign up</button>
				</form>

				<p>{message}</p>
			</div>
		</>
	);
}
