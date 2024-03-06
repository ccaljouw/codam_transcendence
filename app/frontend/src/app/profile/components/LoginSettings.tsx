"use client";
import { useEffect, useState } from 'react';
import { UserProfileDto } from '../../../../../backend/src/users/dto/user-profile.dto';
import DataFetcherJson from "../../../components/DataFetcherJson";
import DataField from "../../../components/DataField";

export default function LoginSettings() {
	const [user, setUser] = useState< UserProfileDto | null >(null);

	useEffect(() => {
		getData();
	}, []);

	async function getData(){
		const userId = sessionStorage.getItem('userId'); // todo: change to token
		const result = await DataFetcherJson({url: 'http://localhost:3001/users/' + userId});
		setUser(result);
		if (!result) // todo: check if needed
			console.log('Error: LoginSettings fetch result null'); 
	}

	return (
		<>
			<h1>Login settings</h1>
			<p>From database:</p>
			<DataField name="Login name" data={user?.loginName} />
			<DataField name="First name" data={user?.firstName} />
			<DataField name="Last name" data={user?.lastName} />
			<p>
				Button to Enable two-factor authentication, link to change password
			</p>
		</>
	);
}
