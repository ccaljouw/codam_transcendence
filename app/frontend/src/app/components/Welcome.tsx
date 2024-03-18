import { useContext } from "react";
import { TranscendenceContext } from "@ft_global/contextprovider.globalvar";

export default function Welcome() : JSX.Element {
	const {currentUser} = useContext(TranscendenceContext);
	
	return (
		<>
            <h1>Welcome {currentUser.userName},</h1>
            <p>Challenge your friends to play pong and make new ones on the way!</p>
        </>
	);
}
