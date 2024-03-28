import { useContext, useEffect, useState } from "react";
import { TranscendenceContext } from "@ft_global/contextprovider.globalvar";
import { OnlineStatus } from "@prisma/client";

const StatusDisplay = {
	ONLINE: '🟢',
	OFFLINE: '🔴',
	IN_GAME: '🏓',
};

/**
 * Function to display the online status of the user
 * @param props userId: id of the user, status: status of the user, indexInUserList: index of the user in the user list, statusChangeCallback: callback to update the user list
 * @returns JSX.Element
 */
export default function StatusIndicator(props: {userId: number, status: OnlineStatus, indexInUserList: number, statusChangeCallback: (idx: number) => void}) : JSX.Element {
	const [status, setStatus] = useState<string>(props.status == null ? StatusDisplay.OFFLINE : StatusDisplay[props.status]);
	const {someUserUpdatedTheirStatus} = useContext(TranscendenceContext);

	useEffect(() => {
		if(someUserUpdatedTheirStatus === undefined) // if the context is not yet initialized, return
			return;
		if(someUserUpdatedTheirStatus.userId == props.userId) // if the user that updated their status is the same as the user we are displaying the status for
		{
			if (someUserUpdatedTheirStatus.status != null)
			{
				setStatus(StatusDisplay[someUserUpdatedTheirStatus.status]);
				if (someUserUpdatedTheirStatus.status !== OnlineStatus.OFFLINE) //if the new status is other than offline, we need to update the user list
					props.statusChangeCallback(props.indexInUserList);
			}
		}
	}, [someUserUpdatedTheirStatus]);

	return (
		<>{status}</>
	);
}