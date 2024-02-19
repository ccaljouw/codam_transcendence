export default function Welcome({name} : {name:string}) {
	return (
        <>
            <h1>Welcome {name? name : "anonymous user"},</h1>
            <p>Challenge your friends to play pong and make new ones on the way!</p>
        </>
	);
}
