import Login from "./components/Login";

export default function Page({error} : {error: Error | null}) : JSX.Element { 
	return (
		<>
			<Login/>
			{error != null && 
				<div className="white-box">
					<p>Error: {error.message}</p>
				</div>
			}
		</>
	);
}
