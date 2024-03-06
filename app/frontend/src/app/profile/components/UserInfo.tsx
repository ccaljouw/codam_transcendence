'use client'
import React, { useState, useEffect } from 'react';
import { UserProfileDto } from '../../../../../backend/src/users/dto/user-profile.dto';
import DataFetcherJson from '../../../components/DataFetcherJson';
import DataField from '../../../components/DataField';

export default function UserInfo() {
	const [user, setUser] = useState< UserProfileDto | null >(null);

	useEffect(() => {
		getData();
	}, []);

	async function getData(){
		try {
			const userId = sessionStorage.getItem('userId'); // todo: change to token
			const result = await DataFetcherJson({url: 'http://localhost:3001/users/' + userId}) as UserProfileDto;
			setUser(result);
		}
		catch (error) {
			console.error('Error in UserInfo getData:', error);
		}
	}

	if (user == null)
	{
		return (
			<>
				<h1>User information</h1>
				<p>Loading...</p>
			</>
		);
	}

	return (
		<>
			<h1>User information</h1>
			<p>From database:</p>
			<DataField name="Avatar" data={user?.avatarId} />
			<DataField name="Username" data={user?.userName}/>
			<DataField name="Online" data={user?.online} />
			<DataField name="Rank" data={"#" + user?.rank} />
		</>
	);
}
