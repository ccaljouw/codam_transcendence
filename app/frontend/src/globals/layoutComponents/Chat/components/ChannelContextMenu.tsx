import { UserProfileDto } from "@ft_dto/users";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar";
import useFetch from "src/globals/functionComponents/useFetch";
import { UpdateChatUserDto } from "@ft_dto/chat";
import { constants } from "src/globals/constants.globalvar";
import { useEffect, useContext, useState } from "react";
import { ChatUserRole } from "@prisma/client";
import style from '../../UserContextMenu/styles.module.css';

export default function ChannelContextMenu({ user, currentChatUser }: { user: UserProfileDto, currentChatUser: UpdateChatUserDto | null }): JSX.Element {
	const { currentUser, currentChatRoom } = useContext(TranscendenceContext);
	const { data: chatUser, isLoading: chatUserLoading, error: chatUserError, fetcher: chatUserFetcher } = useFetch<null, UpdateChatUserDto>();
	const { data: fetchBanKick, isLoading: fetchBanKickLoading, error: fetchBanKickError, fetcher: fetchBanKickFetcher } = useFetch<null, boolean>();
	const [isDropdownVisible, setDropdownVisible] = useState<Boolean>(false);

	const toggleMenu = () => {
		setDropdownVisible(!isDropdownVisible);
	}

	useEffect(() => {
		chatUserFetcher({ url: constants.CHAT_GET_CHATUSER + currentChatRoom.id + '/' + user.id, fetchMethod: 'GET' });
	}, []);

	const handleAdminClick = (makeAdmin: boolean) => {
		toggleMenu();
		const newRole = makeAdmin ? ChatUserRole.ADMIN : ChatUserRole.DEFAULT;
		chatUserFetcher({ url: constants.CHAT_CHANGE_USER_ROLE + currentChatRoom.id + '/' + user.id + '/' + newRole + '/' + currentUser.id, fetchMethod: 'PATCH' });
	}

	const handleKickClick = () => {
		toggleMenu();
		fetchBanKickFetcher({ url: constants.CHAT_KICK_USER + user.id + '/' + user.userName + '/' + currentChatRoom.id + '/' + currentUser.id, fetchMethod: 'GET' });
	}

	const handleMuteClick = () => {
		toggleMenu();
		chatUserFetcher({ url: constants.CHAT_MUTE_USER + currentChatRoom.id + '/' + user.id + '/' + user.userName + '/' + currentUser.id, fetchMethod: 'GET' });
	}

	const handleBanClick = () => {
		toggleMenu();
		fetchBanKickFetcher({ url: constants.CHAT_BAN_USER + currentChatRoom.id + '/' + user.id + '/' + user.userName + '/' + currentUser.id, fetchMethod: 'GET' });
	}
	return (
		<>
		  {/* Show actions only if the user is not an OWNER */}
		  {chatUser?.role !== ChatUserRole.OWNER && (
			<>
			  {/* Dropdown toggle button */}
			  <a onClick={toggleMenu} className={style.userLink}>
				{!isDropdownVisible ? "☰" : "〣"}
			  </a>
	  
			  {/* Dropdown menu with options */}
			  {isDropdownVisible && (
				<>
				  <br />
				  &nbsp;&nbsp;&nbsp;&nbsp;
	  
				  {/* User actions */}
				  <>
					{/* Mute user */}
					<span className={style.userlink_item} onClick={handleMuteClick} title="Mute user for 30 seconds">🔇</span>
	  
					{/* Kick user */}
					<span className={style.userlink_item} onClick={handleKickClick} title="Kick user from channel">🦵</span>
	  
					{/* Ban user */}
					<span className={style.userlink_item} onClick={handleBanClick} title="Ban user from channel">🚷</span>
	  
					{/* Admin privileges control */}
					{currentChatUser?.role === ChatUserRole.OWNER && (
					  chatUser?.role === ChatUserRole.DEFAULT ? (
						<span className={style.userlink_item} onClick={() => handleAdminClick(true)} title="Make user admin of this channel">👑</span>
					  ) : (
						<span
						  onClick={() => handleAdminClick(false)}
						  className={style.userlink_item}
						  style={{ display: "inline-block", transform: 'rotate(180deg)' }}
						  title="Remove admin privileges for this user"
						>
						  👑
						</span>
					  )
					)}
				  </>
				</>
			  )}
			</>
		  )}
		</>
	  );
	}