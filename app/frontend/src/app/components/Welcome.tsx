import { useContext } from "react";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar.tsx";

export default function Welcome() : JSX.Element {
	const {currentUser} = useContext(TranscendenceContext);

	// useEffect(() => {
	// 	if (typeof window !== 'undefined' && sessionStorage && sessionStorage.getItem != null) {
	// 		const userNameFromSession = sessionStorage.getItem('userName');
	// 		const userIdFromSession = sessionStorage.getItem('userId');
	// 		if (userNameFromSession && userNameFromSession != '')
	// 		{
	// 			setCurrentUserName(userNameFromSession);
	// 		}
	// 		if (userIdFromSession && userIdFromSession != '')
	// 		{
	// 			setCurrentUserId(parseInt(userIdFromSession));
	// 			if ((!userNameFromSession || userNameFromSession == '') && currentUserId != 0)
	// 				fetchUserName(currentUserId.toString());
	// 		}
	// 	}
	// }, [currentUserName, someUserUpdatedTheirStatus]);

	// const fetchUserName = async (id: string | null) =>
	// {
	// 	console.log(`fetching user for id [${id}]`);
	// 	if (!id || id == '' || id == '0')
	// 		return ;	
	// 	const response = await fetch(constants.BACKEND_ADRESS_FOR_WEBSOCKET + 'users/' + id);
	// 	const responseJSON : UserProfileDto = await response.json();
	// 	const userNameFromDb = responseJSON.userName;
	// 	setCurrentUserName(userNameFromDb);
	// }
	
	return (
		<>
            <h1>Welcome {currentUser.userName},</h1>
            <p>Challenge your friends to play pong and make new ones on the way!</p>
        </>
	);
}

//todo: JMA: use generic data fetcher. Use userName instead of loginName