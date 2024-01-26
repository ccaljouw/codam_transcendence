import React from "react";
import MenuBar from "../Components/MenuBar/MenuBar.tsx";
import SignUp from "../Components/SignUp/SignUp.tsx";
import Chat from "../Components/Chat/Chat.tsx";

export default function App() {
	return (
		<>
		<div className={"transcendence-SignUp"}>
			<MenuBar />
			<br />
			<h1>Sign up page</h1>
			<p>Here you can create an acount. You can not chat, because you are not logged in yet</p>
			<SignUp />
		</div>
		</>
	);
}
