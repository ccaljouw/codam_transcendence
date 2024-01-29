// import React from 'react'; // This is not used
import Welcome from "../Components/Welcome.tsx";
import Chat from '../Components/Chat.tsx';
import Leaderboard from '../Components/Leaderboard.tsx';
import Users from '../Components/Users.tsx';

export default function App() {
	return (
		<>
			<div className="transcendence-Home">
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
				<Chat />
			</div>
		</>
	);
}
