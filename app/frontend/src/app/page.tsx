"use client";
import Welcome from "./components/Welcome.tsx";
import Leaderboard from './components/Leaderboard.tsx';

export default function Page() : JSX.Element {
	return (
		<>
			<div>
				<div className="row white-box">
					<div className="col col-12">
						<Welcome />
					</div>
					<div className="col col-12 col-lg-6">
						<Leaderboard />
					</div>
				</div>
			</div>
		</>
	);
}
