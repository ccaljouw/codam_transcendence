"use client";
import {useState} from 'react';

async function PostNewUser(formData: FormData) {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(Object.fromEntries(formData))
	};
	console.log(requestOptions);
	try {
		const response = await fetch('http://localhost:3001/authentication/register', requestOptions);
		const data = await response?.json();
		console.log(data.id);
		sessionStorage.setItem("userId", data.id);
		if (!response?.ok)
			return ("Error creating new user: " + data.message); // messages coherent
		return ("Succesfully created new user: " + String(data.id));
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
				<h1>Sign up to play</h1>
				<form className="form" action={handleSubmit}>
					<label>Email:
						<input type="text" name="email" /><br />
					</label>
					<br/>
					<label>Password:
						<input type="text" name="password" /><br />
					</label>
					<br/>
					<label>First Name:
						<input type="text" name="firstName" /><br />
					</label>
					<br/>
					<label>Last Name:
						<input type="text" name="lastName" /><br />
						<input type="submit" value="Submit" />
					</label>
				</form>
				<p>{message}</p>
			</div>
		</>
	);
}
