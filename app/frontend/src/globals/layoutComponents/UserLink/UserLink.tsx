import style from './styles.module.css';
import { useState } from 'react';

export default function UserLink({id, userName} : {id: number, userName: string}) : JSX.Element {
	const [isDropdownVisible, setDropdownVisible] = useState(false);

	const handleMouseEnter = () => {
		setDropdownVisible(true);
	};

	const handleMouseLeave = () => {
		setDropdownVisible(false);
	};

	function handleDmClick(){
		console.log(`Open the DM screen with this user: ${userName}`);
	}

	function handleGameClick(){
		console.log(`Invite this user to play a game: ${userName}`);
	}

	function handleBlockClick(){
		console.log(`Block this user: ${userName}`);
		//todo: after blocking a user, the userList should be updated
	}

	function handleInviteClick(){
		console.log(`Invite this user to be friends: ${userName}`);
	}

	return (
		<div className={style.userLink} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
			<div className="row">
				<div className="col">
					<a onClick={handleDmClick}>{userName}</a>
				</div>
				<div className="col">
					{isDropdownVisible && 
						<>
							<button onClick={handleGameClick}>Play game</button>
							<button onClick={handleBlockClick}>Block</button>
							<button onClick={handleInviteClick}>Invite friend</button>
						</>}
				</div>
			</div>
		</div>
	);
}

//todo: expand handleClick functions