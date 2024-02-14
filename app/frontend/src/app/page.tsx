import Welcome from "../components/Welcome.tsx";
import Leaderboard from '../components/Leaderboard.tsx';
import Users from '../components/Users.tsx';
import Chat from '../components/Chat.tsx';
import { useEffect } from "react";

export default function Page() {
	return (
		<>
			<div>
				<br />
				<h1>Home page</h1>
				<p>Here you can see the welcome text, leaderboard and users. Chat on the bottom</p>
				<br />
				<Welcome />
				<br />
					<div className="row">
						<div className="col-sm-6">
							<Leaderboard />
						</div>
						<div className="col-sm-6">
							<Users />
						</div>
					</div>
				<br />
				{/* <Chat /> */}
			</div>
		</>
	);
}
