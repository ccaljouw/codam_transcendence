'use client'
import React, { useState, useEffect } from 'react';
import { UserProfileDto } from '../../../../../backend/src/users/dto/user-profile.dto';
// import DataFetcherJson from '../../../components/DataFetcherJson';
import DataField from '../../../components/DataField';
import useFetch from 'src/components/useFetch';

export default function UserInfo() {
	const { data: user, isLoading, error, fetcher } = useFetch<null, UserProfileDto>();
	
	useEffect(() => {
		fetchUser();
	}, []);

	async function fetchUser(){
		const userId = sessionStorage.getItem('userId'); // todo: change to token

		await fetcher({
			url: 'http://localhost:3001/users/' + userId,
			// fetchMethod: 'GET',
		});
	}

	return (
		<>
			<h1>User information</h1>
			{isLoading && <p>Loading...</p>}
			{error && <p>Error: {error.message}</p>}
			{user && (<>
				<p>From database:</p>
				<DataField name="Avatar" data={user.avatarId} />
				<DataField name="Username" data={user.userName}/>
				<DataField name="Online" data={user.online} />
				<DataField name="Rank" data={"#" + user.rank} /> 
			</>)}
		</>
	);
}
