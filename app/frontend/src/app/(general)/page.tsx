import Welcome from "./components/Welcome.tsx";
import Leaderboard from './components/Leaderboard.tsx';

export default function Page() : JSX.Element {
	return (
		<>
			<div>
				<div className="row">
					<div className="col col-6 white-box">
						<Welcome />
					</div>
					<div className="col col-6 white-box">
						<Leaderboard />
					</div>
				</div>
			</div>
		</>
	);
}
