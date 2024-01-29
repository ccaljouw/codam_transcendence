// import React from "react";  // This is not used
import SignUp from "../Components/SignUp.tsx";

export default function App() {
	return (
		<>
			<div className="transcendence-SignUp">
				<br />
				<h1>Sign up page</h1>
				<p>Here you can create an acount. You can not chat, because you are not logged in yet</p>
				<SignUp />
			</div>
		</>
	);
}
