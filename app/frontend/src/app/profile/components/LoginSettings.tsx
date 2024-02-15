"use client";
import { useEffect, useState } from 'react';
import InfoField from "../../../components/DataField";
import FetchUser from "../../../components/FetchUser";

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
		<>
			<h1>Login settings</h1>
			<p>From database:</p>
			<InfoField name="Login name" data={loginName} />
			<InfoField name="First name" data={firstName} />
			<InfoField name="Last name" data={lastName} />
			<p>
				Button to Enable two-factor authentication, link to change password
			</p>
		</>
	);
}
