import ProfileClient from "./components/ProfileClient";

export default function Page({params} : {params: {username: string}}) : JSX.Element {
	
	return (
		<>
			<ProfileClient userName={params.username}/>
		</>
	);
}
