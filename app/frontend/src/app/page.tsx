import Welcome from "../components/Welcome.tsx";
import Leaderboard from '../components/Leaderboard.tsx';
import Users from '../components/Users.tsx';
import Chat from '../components/Chat.tsx';

export default function Page() {
	return (
		<>
			<Welcome />
			<div className="row">
				<div className="col col-md-6 mt-3">
					<Leaderboard />
				</div>
				<div className="col col-md-6 mt-3">
					<Users />
				</div>
			</div>
		</>
	);
}
