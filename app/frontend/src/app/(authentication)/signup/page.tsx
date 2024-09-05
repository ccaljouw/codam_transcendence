import Signup from "./components/Signup";

export default function Page({error} : {error: Error | null}) : JSX.Element { 
	return (
		<>
			<Signup/>
			{error != null && <div className="white-box">Error: {error.message}</div>}
		</>
	);
}
