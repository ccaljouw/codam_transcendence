import { UserProfileDto } from '@ft_dto/users';
import style from './styles.module.css';
import { useContext, useEffect, useState } from 'react';
import { UserListContext } from 'src/globals/functionComponents/UserList';

export default function UserContextMenu({user} : 
	{
		user: UserProfileDto, 

	}) : JSX.Element {
	const [isDropdownVisible, setDropdownVisible] = useState(false);
	const {contextMenuClickSent, triggerContextMenuClick} = useContext(UserListContext);

	useEffect(() => {
		if (contextMenuClickSent !== user.id) // close dropdown if another user was clicked
			setDropdownVisible(false);
	}, [contextMenuClickSent]);

	const toggleMenu = () => {
		triggerContextMenuClick(user.id);
		setDropdownVisible(!isDropdownVisible);
	}

	function handleGameClick(){
		setDropdownVisible(false);
		console.log(`Invite this user to play a game: ${user.userName}`);
	}

	function handleBlockClick(){
		setDropdownVisible(false);
		console.log(`Block this user: ${user.userName}`);
		//todo: after blocking a user, the userList should be updated
	}

	function handleInviteClick(){
		setDropdownVisible(false);
		console.log(`Invite this user to be friends: ${user.userName}`);
	}

	return (
		<>
				<a onClick={toggleMenu} className={style.userLink}> {!isDropdownVisible? "☰" : "〣"}</a> 
					{isDropdownVisible && 
						<>
						<br/>
						&nbsp;&nbsp;&nbsp;&nbsp;
							<span className={style.userlink_item} onClick={handleGameClick} title='Invite to game'> 🏓</span> | 
							<span className={style.userlink_item}  title='Invite to chat'>💬</span> |
							<span className={style.userlink_item} onClick={handleInviteClick} title='Invite as friend'>🤝</span> |
							<span className={style.userlink_item} onClick={handleBlockClick} title='Block user'>⛔</span> 
						</>}
		</>
	);
}

//todo: expand handleClick functions