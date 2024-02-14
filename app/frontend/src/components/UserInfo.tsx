'use client'
import React, { useState, useEffect } from 'react';
import InfoField from './utils/InfoField';
import fetchUser from './utils/FetchUser';

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
			<p>
				<InfoField name="Avatar" data={avatarId} />
				<InfoField name="Username" data={userName}/>
				<InfoField name="Online" data={online} />
				<InfoField name="Rank" data={"#" + rank} />
			</p>
		</>
	);
}

// {data ? (<pre>{JSON.stringify(data, null, 2)}</pre>) : (<p>Loading data...</p>)}
