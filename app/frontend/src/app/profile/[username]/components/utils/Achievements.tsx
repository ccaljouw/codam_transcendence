function Achievement({icon, title, description} : {icon:string, title: string, description:string}) : JSX.Element {
	return (
		<>
			<button className="btn" role="button" data-bs-toggle="dropdown" aria-expanded="false">
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
	const achievements = [	{id: "🏅", title: "First Victory", description: "Awarded when the player wins their first game."}, //amount of wins related
							{id: "🔥", title: "Win Streak", description: "Given when a player wins three games in a row."},
							{id: "💯", title: "Century Club", description: "Earned when a player wins 100 games"},
							{id: "🏆", title: "Champion", description: "Awarded for reaching rank #1."},
							
							{id: "😅", title: "Close Call", description: "Awarded for winning a game by a margin of only one point."}, //point ratio related
							{id: "🏋️‍♂️", title: "Flexing Champion", description: "Awarded when winning a match without losing a single point."},
							{id: "🎾", title: "Long Rally", description: "Given for a rally that lasts more than 20 hits back and forth."},
							{id: "🐶", title: "Underdog", description: "Awarded when a player beats an opponent who has won more than twice as many games as they have."},

							{id: "🐦", title: "Early Bird", description: "Awarded for playing a game before 7 AM."},	//time related
							{id: "🦉", title: "Night Owl", description: "Awarded for playing a game after midnight."},
							{id: "⏱️", title: "Marathon Match", description: "Earned when a single game lasts more than 10 minutes."},
							
							{id: "🤖", title: "Bot battle", description: "Awarded for playing match against the computer."}, //features related
							{id: "🎮", title: "In Control", description: "Awarded for using the strongpong controller."},
							{id: "💬", title: "Communicator", description: "Awarded for sending more then 100 messages to someone."},

							{id: "🏓", title: "POMG", description: "Awarded for being a StrongPong developer."}];
							
	if (index >= achievements.length)
		return (<Achievement icon="x" title="No Achievement" description="This achievement does not exist yet"/>);
	return (<Achievement icon={achievements[index].id} title={achievements[index].title} description={achievements[index].description}/>);
}

export default function Achievements({achievements} : {achievements:number[]}) : JSX.Element {
	const achievementList = achievements.map(achievement => 
		<div key={achievement} className="col">
			<ChooseAchievementElement index={achievement}/>
		</div>
	);

	return (
		<>
			<div className="row">
				<div className="col col-3">
					<p>Achievements</p>
				</div>
				<div className="col col-9 container">
					<div className="row justify-content-start">
						{achievementList}
					</div>
				</div>
			</div>
		</>
	);
}
