import Profile from "../../components/Profile.tsx";
import Settings from "../../components/Settings.tsx";
import Chat from "../../components/Chat.tsx";

export default function Page() {
	return (
		<>
			{/* <div className="transcendenceProfile"> */}
				<br />
				<h1>Profile page</h1>
				<p>Here you can look at your profile and change settings</p>
				<Profile />
				<br />
				<Settings />
			{/* </div> */}
		</>
	);
}
