'use client'
import { useEffect } from 'react';
import { UserProfileDto } from '../../../../../backend/src/users/dto/user-profile.dto';
import DataField from '../../../components/DataField';
import useFetch from 'src/components/useFetch';

export default function UserInfo(): JSX.Element {
	const { data: user, isLoading, error, fetcher } = useFetch<null, UserProfileDto>();
	
	useEffect(() => {
		fetchUser();
	}, []);

	const fetchUser = async () => {
		const userId = sessionStorage.getItem('userId'); // todo: change to token
		await fetcher({url: 'http://localhost:3001/users/' + userId});
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
