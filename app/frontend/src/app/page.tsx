import Welcome from "../components/Welcome.tsx";
import Leaderboard from '../components/Leaderboard.tsx';
import Users from '../components/Users.tsx';

export default function Page() {
	return (
		<>
			<div className="row">
				<div className="col component">
					<Welcome />
				</div>
			</div>
			<div className="row">
				<div className="col component">
					<Leaderboard />
				</div>
				<div className="col component">
					<Users />
				</div>
			</div>
		</>
	);
}
