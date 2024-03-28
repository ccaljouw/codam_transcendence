import { UserProfileDto } from '@ft_dto/users';
import style from './styles.module.css';
import { useState } from 'react';
import StatusIndicator from '@ft_global/functionComponents/StatusIndicator';
import UnreadMessages from '@ft_global/functionComponents/UnreadMessages';

export default function UserContextMenu({user} : 
	{
		user: UserProfileDto, 

	}) : JSX.Element {
	const [isDropdownVisible, setDropdownVisible] = useState(false);

	const toggleMenu = () => {
		setDropdownVisible(!isDropdownVisible);
	}

	function handleGameClick(){
		console.log(`Invite this user to play a game: ${user.userName}`);
	}

	function handleBlockClick(){
		console.log(`Block this user: ${user.userName}`);
		//todo: after blocking a user, the userList should be updated
	}

	function handleInviteClick(){
		console.log(`Invite this user to be friends: ${user.userName}`);
	}

	return (
		<>
				<a onClick={toggleMenu} className={style.userLink}> {!isDropdownVisible? "☰" : "〣"}</a> 
					{isDropdownVisible && 
						<>
						<br/>
							<button onClick={handleGameClick}>Play game</button>
							<button onClick={handleBlockClick}>Block</button>
							<button onClick={handleInviteClick}>Invite friend</button>
						</>}
		</>
	);
}

//todo: expand handleClick functions