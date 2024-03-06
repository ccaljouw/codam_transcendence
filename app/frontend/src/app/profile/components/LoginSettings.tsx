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

	async function getData(){ // todo: add return type
		try {

			const userId = sessionStorage.getItem('userId'); // todo: change to token
			const userData = await DataFetcherJson({url: 'http://localhost:3001/users/' + userId}) as UserProfileDto;
			setUser(userData);
		} catch (error) {
			console.error('Error in LoginSettings:', error);
		}
	}

	if (user == null)
	{
		return (
			<>
				<h1>Login settings</h1>
				<p>Loading...</p>
			</>
		);
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
