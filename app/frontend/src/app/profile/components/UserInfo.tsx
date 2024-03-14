'use client'
import { useContext } from 'react';
import { TranscendenceContext } from '@global/vars';
import DataField from '@functionComponents/DataField';

export default function UserInfo(): JSX.Element {
	const {currentUser} = useContext(TranscendenceContext);

	return (
		<>
			<h1>User information</h1>
			<p>From database:</p>
			<DataField name="Avatar" data={currentUser.avatarId} />
			<DataField name="Username" data={currentUser.userName}/>
			<DataField name="Online" data={currentUser.online} />
			<DataField name="Rank" data={"#" + currentUser.rank} /> 
		</>
	);
}
