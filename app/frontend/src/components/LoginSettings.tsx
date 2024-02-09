"use client";

import { useEffect, useState } from 'react';
import InfoField from "./utils/InfoField";
import FetchUser from "./utils/FetchUser";

export default function LoginSettings() {
	const [loginName, setLoginName] = useState<string>("");
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");

	useEffect(() => {
		getData();
	}, []);

	async function getData(){
		const result = await FetchUser();
		setLoginName(result.loginName);
		setFirstName(result.firstName);
		setLastName(result.lastName);
	}
	return (
		<div className="component">
			<h1>Login settings</h1>
			<InfoField name="Login name" data={loginName} />
			<InfoField name="First name" data={firstName} />
			<InfoField name="Last name" data={lastName} />
			<p>
				Button to Enable two-factor authentication, link to change password
			</p>
		</div>
	);
}
