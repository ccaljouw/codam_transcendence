import { useEffect } from "react";

export default function Welcome({name} : {name:string}) {
	useEffect(() => { //todo: JMA: remove this useEffect before submit?
		console.log("Welcome rendered");
	},[])
	return (
        <>
            <h1>Welcome {name},</h1>
            <p>Challenge your friends to play pong and make new ones on the way!</p>
        </>
	);
}
