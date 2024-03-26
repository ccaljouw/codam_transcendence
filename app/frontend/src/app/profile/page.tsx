import UserInfo from "./components/UserInfo.tsx";
import Stats from "./components/Stats.tsx";
import MatchHistory from "./components/MatchHistory.tsx";
import GameSettings from "./components/GameSettings.tsx";
import LoginSettings from "./components/LoginSettings.tsx";
import Blocked from "./components/Blocked.tsx";
import { FontBangers } from 'src/globals/layoutComponents/Font';

export default function Page() : JSX.Element {
	return (
		<>
			<FontBangers>
				<h3>Profile page</h3>
			</FontBangers>
			<div className="row">
				<p>The information below is public:</p>
				<div className="col col-lg-4 col-md-6 col-12">
					<UserInfo />
				</div>
				<div className="col col-lg-4 col-md-6 col-12">
					<Stats />
				</div>
				<div className="col col-lg-4 col-md-6 col-12">
					<MatchHistory />
				</div>
			</div>
			<div className="row">
				<p>The information below is only visible to you:</p>
				<div className="col col-lg-4 col-md-6 col-12">
					<GameSettings />
				</div>
				<div className="col col-lg-4 col-md-6 col-12">
					<LoginSettings />
				</div>
				<div className="col col-lg-4 col-md-6 col-12">
					<Blocked />
				</div>
			</div>
		</>
	);
}
