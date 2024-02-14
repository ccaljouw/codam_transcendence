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
			<div className="transcendenceProfile">
				<br />
				<h1>Profile page</h1>
				<p>The information below is public:</p>
				<UserInfo />
				<Stats />
				<MatchHistory />
				<br />
				<p>The information below is only visible to you:</p>
				<GameSettings />
				<LoginSettings />
				<Blocked />
				<br />
				<Chat />
			</div>
		</>
	);
}
