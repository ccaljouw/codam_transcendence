import { useEffect } from "react";

export default function Welcome({name} : {name:string}) {
	useEffect(() => {
		console.log("Welcome rendered");
	},[])
	return (
        <>
		<div className="component welcome">
            <h1>Welcome {name},</h1>
            <p>Challenge your friends to play pong and make new ones on the way!</p>
		</div>
        </>
	);
}
