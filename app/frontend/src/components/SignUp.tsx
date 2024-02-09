"use client";
import {useState} from 'react';

function formFieldText({description, name}:{description:string, name:string}) {
	return (
		<>
			<label>{description}
				<input type="text" name={name} /><br />
			</label>
			<br/>
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
			return ("Error creating new user: " + response.status + ": " + response.statusText); // messages coherent
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
				<h1>Sign up to play</h1>
				<form className="form" action={handleSubmit}>
					{/* <formFieldText description="Username" name="userName" />
					<formFieldText description="First name" name="firstName" />
					<formFieldText description="Last name" name="lastName" />
					<formFieldText description="Email" name="email" />
					<formFieldText description="Password" name="hash" /> */}
					<label>Username:
						<input type="text" name="userName" /><br />
					</label>
					<br/>
					<label>First Name:
						<input type="text" name="firstName" /><br />
					</label>
					<br/>
					<label>Last Name:
						<input type="text" name="lastName" /><br />
					</label>
					<br/>
					<label>Login name:
						<input type="text" name="loginName" /><br />
					</label>
					<br/>
					<label>Email:
						<input type="text" name="email" /><br />
					</label>
					<br/>
					<label>Password:
						<input type="text" name="hash" /><br />
					</label>
					<br/>
					{/* <label>Online:
						<input type="number" name="online" /><br />
					</label>
					<br/> */}
					<label>Sign up:
						<input type="submit" value="Submit" />
					</label>
				</form>
				<p>{message}</p>
			</div>
		</>
	);
}
