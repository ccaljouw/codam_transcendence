"use client";
import { useContext } from 'react';
import DataField from "../../../components/DataField";
import { TranscendenceContext } from 'src/globals/contextprovider.globalvar';

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
