'use client'
import { useContext } from 'react';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import DataField from '@ft_global/functionComponents/DataField';
import { FontBangers } from 'src/globals/layoutComponents/Font';

export default function UserInfo(): JSX.Element {
	const {currentUser} = useContext(TranscendenceContext);

	return (
		<>
			<FontBangers>
				<h3>User information</h3>
			</FontBangers>
			<p>From database:</p>
			<DataField name="Avatar" data={currentUser.avatarId} />
			<DataField name="Username" data={currentUser.userName}/>
			<DataField name="Online" data={currentUser.online} />
			<DataField name="Rank" data={"#" + currentUser.rank} /> 
		</>
	);
}
