import { useContext, useEffect, useState } from "react";
import { TranscendenceContext } from "@ft_global/contextprovider.globalvar";
import { OnlineStatus } from "@prisma/client";
import { IsBlocked } from "./FriendOrBlocked";

const StatusDisplay = {
	ONLINE: '🟢',
	OFFLINE: '🔴',
	IN_GAME: '🏓',
	BLOCKED: '🚫',
};

/**
 * Function to display the online status of the user
 * @param props userId: id of the user, status: status of the user, indexInUserList: index of the user in the user list, statusChangeCallback: callback to update the user list
 * @returns JSX.Element
 */
export default function StatusIndicator(props: { userId: number, status: OnlineStatus, indexInUserList: number, statusChangeCallback: (idx: number, newStatus: OnlineStatus) => void }): JSX.Element {
	const [status, setStatus] = useState<string>(props.status == null ? StatusDisplay.OFFLINE : StatusDisplay[props.status]);
	const [displayStatus, setDisplayStatus] = useState<string>(props.status == null ? StatusDisplay.OFFLINE : StatusDisplay[props.status]);
	const { someUserUpdatedTheirStatus, currentUser } = useContext(TranscendenceContext);

	useEffect(() => {
		// console.log("StatusIndicator: useEffect", props.userId, currentUser);
		if (someUserUpdatedTheirStatus === undefined) // if the context is not yet initialized, return
			return;

		if (someUserUpdatedTheirStatus.userId == props.userId	// if the user that updated their status is the same as the user we are displaying the status for
			&& someUserUpdatedTheirStatus.status != null		// if the new status is not null
			&& someUserUpdatedTheirStatus.status !== props.status // if the new status is different from the current status
		) {
			setStatus(StatusDisplay[someUserUpdatedTheirStatus.status]);
			props.statusChangeCallback(props.indexInUserList, someUserUpdatedTheirStatus.status);
			setDisplayStatus(StatusDisplay[someUserUpdatedTheirStatus.status]);
		}
		else if (status)
			setDisplayStatus(status);
		if (IsBlocked(props.userId, currentUser)) // if the user is blocked, display the blocked status
			setDisplayStatus(StatusDisplay.BLOCKED);
		// else
			
	}, [someUserUpdatedTheirStatus, currentUser]);

	// useEffect(() => {
	// 	if (IsBlocked(props.userId, currentUser)) {
	// 		setDisplayStatus(StatusDisplay.BLOCKED);
	// 		return;
	// 	}else{
	// 		setDisplayStatus(status);
	// 	}
	// },[currentUser])

	return (
		<>
			{displayStatus}
		</>
	);
}
