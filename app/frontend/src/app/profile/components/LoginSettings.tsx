"use client";
import { useContext } from 'react';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
// import DataField from "@ft_global/functionComponents/DataField";
import DataField from "../../../globals/functionComponents/DataField";
import { FontBangers } from 'src/globals/layoutComponents/Font';

export default function LoginSettings(): JSX.Element {
	const {currentUser} = useContext(TranscendenceContext);

	return (
		<>
			<FontBangers>
				<h3>User information</h3>
			</FontBangers>
			<p>From context:</p>
			<DataField name="Login name" data={currentUser.loginName} />
			<DataField name="First name" data={currentUser.firstName} />
			<DataField name="Last name" data={currentUser.lastName} />
			<p>
				Button to Enable two-factor authentication, link to change password
			</p>
		</>
	);
}
