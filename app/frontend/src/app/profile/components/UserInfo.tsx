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
			const result = await DataFetcherJson({url: 'http://localhost:3001/users/' + userId});
			setUser(result);
			if (!result) //todo: check if needed
				console.log('Error: UserInfo fetch result not ok');
		}
		catch (error) {
			console.error('Error fetching data:', error);
		}
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
