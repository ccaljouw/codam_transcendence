"use client";
import { useEffect, useState } from 'react';
import { UserProfileDto } from '../../../../../backend/src/users/dto/user-profile.dto';
// import DataFetcherJson from "../../../components/DataFetcherJson";
import DataField from "../../../components/DataField";

export default function LoginSettings() {
	const { data: user, isLoading, error, fetcher } = useFetch<UserProfileDto>();

	useEffect(() => {
		fetchUser();
	}, []);

	async function fetchUser(){
		const userId = sessionStorage.getItem('userId'); // todo: change to token

		await fetcher({
			url: 'http://localhost:3001/users/' + userId,
			fetchMethod: 'GET',
			payload: null
		});
	}

	return (
		<>
			<h1>User information</h1>
			{isLoading && <p>Loading...</p>}
			{error && <p>error</p>}
			{user && (<>
			<p>From database:</p>
			<DataField name="Login name" data={user?.loginName} />
			<DataField name="First name" data={user?.firstName} />
			<DataField name="Last name" data={user?.lastName} />
			<p>
				Button to Enable two-factor authentication, link to change password
			</p>
			</>)}
		</>
	);
}
