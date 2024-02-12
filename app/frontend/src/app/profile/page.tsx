import Chat from "../../components/Chat.tsx";
import UserInfo from "../../components/UserInfo.tsx";
import Stats from "../../components/Stats.tsx";
import MatchHistory from "../../components/MatchHistory.tsx";
import Blocked from "../../components/Blocked.tsx";
import GameSettings from "../../components/GameSettings.tsx";
import LoginSettings from "../../components/LoginSettings.tsx";

export default function Page() {
	return (
		<>
			{/* <div className="transcendenceProfile"> */}
				<br />
				<h1>Profile page</h1>
				<p>The information below is public:</p>
				<div className="row">
					<div className="col col-lg-4 col-md-6 col-sm-12 border rounded mt-3">
						<UserInfo />
					</div>
					<div className="col col-lg-4 col-md-6 col-sm-12 border rounded mt-3">
						<Stats />
					</div>
					<div className="col col-lg-4 col-md-6 col-sm-12 border rounded mt-3">
						<MatchHistory />
					</div>
				</div>
				<br />
				<p>The information below is only visible to you:</p>
				<div className="row">
					<div className="col-4 border rounded">
						<GameSettings />
					</div>
					<div className="col-4 border rounded">
						<LoginSettings />
					</div>
					<div className="col-4 border rounded">
						<Blocked />
					</div>
				</div>
				<br />
				<Chat />
			{/* </div> */}
		</>
	);
}
