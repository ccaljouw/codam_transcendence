import { useContext } from "react";
import { TranscendenceContext } from "@ft_global/contextprovider.globalvar";
import { bangers, pop_art, comic_neue } from 'src/globals/layoutComponents/Font';
import H1 from "src/globals/layoutComponents/H1";

export default function Welcome() : JSX.Element {
	const {currentUser} = useContext(TranscendenceContext);
	
	return (
		<>
            <H1>Welcome {currentUser.userName},</H1>
            <p className={comic_neue.className} >Challenge your friends to play pong and make new ones on the way!</p>
        </>
	);
}
