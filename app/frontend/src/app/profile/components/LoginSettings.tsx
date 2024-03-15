"use client";
import { useContext } from 'react';
import { TranscendenceContext } from '@global/contextprovider.globalvar';
import DataField from "@global/functionComponents/DataField";

export default function LoginSettings(): JSX.Element {
	const {currentUser} = useContext(TranscendenceContext);

	return (
		<>
			<h1>User information</h1>
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
