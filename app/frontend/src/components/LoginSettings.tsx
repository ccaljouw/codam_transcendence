import InfoField from "./utils/InfoField";

export default function LoginSettings() {
	return (
		<div className="component">
			<h1>Login settings</h1>
			<InfoField name="Login name" data="from database" />
			<InfoField name="First name" data="from database" />
			<InfoField name="Last name" data="from database" />
			<p>
				Enable two-factor authentication, change password
			</p>
		</div>
	);
}
