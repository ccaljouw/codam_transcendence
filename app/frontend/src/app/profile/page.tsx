import UserInfo from "./components/UserInfo.tsx";
import Stats from "./components/Stats.tsx";
import MatchHistory from "./components/MatchHistory.tsx";
import GameSettings from "./components/GameSettings.tsx";
import LoginSettings from "./components/LoginSettings.tsx";
import Blocked from "./components/Blocked.tsx";

export default function Page() {
	return (
		<>
			<h1>Profile page</h1>
			<div className="row">
				<p>The information below is public:</p>
				<div className="col col-lg-4 col-sm-12 col-12 component">
					<UserInfo />
				</div>
				<div className="col col-lg-4 col-sm-12 col-12 component">
					<Stats />
				</div>
				<div className="col col-lg-4 col-sm-12 col-12 component">
					<MatchHistory />
				</div>
			</div>
			<div className="row">
				<p>The information below is only visible to you:</p>
				<div className="col col-lg-4 col-sm-12 col-12 component">
					<GameSettings />
				</div>
				<div className="col col-lg-4 col-sm-12 col-12 component">
					<LoginSettings />
				</div>
				<div className="col col-lg-4 col-sm-12 col-12 component">
					<Blocked />
				</div>
			</div>
		</>
	);
}
