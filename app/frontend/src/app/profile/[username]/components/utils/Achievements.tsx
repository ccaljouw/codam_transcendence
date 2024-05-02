function Achievement({icon, title, description} : {icon:string, title: string, description:string}) : JSX.Element {
	return (
		<>
			<button className="btn btn-align-dark" role="button" data-bs-toggle="dropdown" aria-expanded="false">
				{icon}
			</button>
			<ul className="dropdown dropdown-menu">
				<li className="dropdown-header">{title}</li>
				<li className="dropdown-item disabled">{description}   </li>
			</ul>
		</>
	);
}

function ChooseAchievementElement({index} : {index:number}) : JSX.Element {
	const achievements = [	["🏅", "First Victory", "Awarded when the player wins their first game."], //amount of wins related
							["🔥", "Win Streak", "Given when a player wins three games in a row."],
							["💯", "Century Club", "Earned when a player wins 100 games"],
							["🏆", "Champion", "Awarded for reaching rank #1."],
							
							["😅", "Close Call", "Awarded for winning a game by a margin of only one point."], //point ratio related
							["🏋️‍♂️", "Flexing Champion", "Awarded when winning a match without losing a single point."],
							["🎾", "Long Rally", "Given for a rally that lasts more than 20 hits back and forth."],
							["🐶", "Underdog", "Awarded when a player beats an opponent who has won more than twice as many games as they have."],

							["🐦", "Early Bird", "Awarded for playing a game before 7 AM."],	//time related
							["🦉", "Night Owl", "Awarded for playing a game after midnight."],
							["⏱️", "Marathon Match", "Earned when a single game lasts more than 10 minutes."],
							
							["🤖", "Bot battle", "Awarded for playing match against the computer."], //features related
							["🎮", "In Control", "Awarded for using the strongpong controller."],
							["💬", "Communicator", "Awarded for sending more then 100 messages to someone."],

							["🏓", "POMG", "Awarded for being a StrongPong developer."]];
							
	if (index >= achievements.length)
		return (<></>);
	return (<Achievement icon={achievements[index][0]} title={achievements[index][1]} description={achievements[index][2]}/>);
}

export default function Achievements({achievements} : {achievements:number[]}) : JSX.Element {
	const achievementList = [];

	for (var i = 0; i < achievements.length; i++) {
		achievementList.push(<ChooseAchievementElement index={achievements[i]}/>);
	}

	return (
		<>
			<div className="row">
				<div className="col col-3">
					<p>Achievements</p>
				</div>
				<div className="col col-9">
					{achievementList}
				</div>
			</div>
		</>
	);
}
