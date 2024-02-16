import Welcome from "./components/Welcome.tsx";
import Leaderboard from './components/Leaderboard.tsx';
import Users from './components/Users.tsx';

export default function Page() {
	return (
		<>
			<div className="row">
				<div className="col col-12">
					<Welcome />
				</div>
				<div className="col col-12 col-lg-6">
					<Leaderboard />
				</div>
				<div className="col col-12 col-lg-6">
					<Users />
				</div>
			</div>
		</>
	);
}
