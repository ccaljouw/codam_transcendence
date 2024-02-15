import Welcome from "./components/Welcome.tsx";
import Leaderboard from './components/Leaderboard.tsx';
import Users from './components/Users.tsx';

export default function Page() {
	return (
		<>
			<Welcome />
			<div className="row">
				<div className="col col-sm-6 col-12">
					<Leaderboard />
				</div>
				<div className="col col-sm-6 col-12">
					<Users />
				</div>
			</div>
		</>
	);
}
