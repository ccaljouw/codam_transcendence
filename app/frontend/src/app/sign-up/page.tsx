import SignUp from "../../components/SignUp.tsx";

export default function Page() {
	return (
		<>
			<div className="transcendenceSignUp">
				<br />
				<h1>Sign up page</h1>
				<p>Here you can create an acount. You can not chat, because you are not logged in yet</p>
				<SignUp />
			</div>
		</>
	);
}
