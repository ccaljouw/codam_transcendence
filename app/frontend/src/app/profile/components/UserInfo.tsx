'use client'
import React, { useState, useEffect } from 'react';
import DataField from '../../../components/DataField';
import fetchUser from '../../../components/FetchUser';

export default function UserInfo() {
	// const [data, setData] = useState< JSON | null >(null);
	const [userName, setUserName] = useState<string>("");
	const [avatarId, setAvatarId] = useState<string>("");
	const [online, setOnline] = useState<string>("");
	const [rank, setRank] = useState<string>("");

	useEffect(() => {
		getData();
	}, []);

	async function getData(){
		const result = await fetchUser();
		setUserName(result.userName);
		setAvatarId(result.avatarId);
		setOnline(result.online);
		setRank(result.rank);
	}

	return (
		<>
			<h1>User information</h1>
			<p>From database:</p>
			<DataField name="Avatar" data={avatarId} />
			<DataField name="Username" data={userName}/>
			<DataField name="Online" data={online} />
			<DataField name="Rank" data={"#" + rank} />
			
		</>
	);
}

// {data ? (<pre>{JSON.stringify(data, null, 2)}</pre>) : (<p>Loading data...</p>)}
