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
				<div className="row mt-3">
				<br />
				<h1>Profile page</h1>
				<p>The information below is public:</p>
					<div className="col col-lg-4 col-sm-12 col-12 mt-3 content">
						<UserInfo />
					</div>
					<div className="col col-lg-4 col-sm-12 col-12  mt-3 content">
						<Stats />
					</div>
					<div className="col col-lg-4 col-sm-12 col-12  mt-3 content">
						<MatchHistory />
					</div>
				</div>
				<br />
				<p>The information below is only visible to you:</p>
				<div className="row">
					<div className="col col-lg-4 col-sm-12 col-12 mt-3 content">
						<GameSettings />
					</div>
					<div className="col col-lg-4 col-sm-12 col-12 mt-3 content">
						<LoginSettings />
					</div>
					<div className="col col-lg-4 col-sm-12 col-12 mt-3 content">
						<Blocked />
					</div>
				</div>
				<br />
				<Chat />
			{/* </div> */}
		</>
	);
}
