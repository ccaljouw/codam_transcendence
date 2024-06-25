import { GameResultDto, StatsDto } from '@ft_dto/stats';
import { UserProfileDto } from '@ft_dto/users';
import { useEffect } from 'react';
import { constants } from 'src/globals/constants.globalvar';
import useFetch from 'src/globals/functionComponents/useFetch';
import { H3 } from 'src/globals/layoutComponents/Font';

function MatchResult({userId, resultId, last10Games} : {userId: number, resultId: number, last10Games: GameResultDto[] | null}) {
	return (
	<>
			<div className="text-center">
				{last10Games != null && last10Games[resultId] != null? 
				<>
					{last10Games[resultId].winnerId && 
					<>
					{/* // <div className={last10Games[resultId].winnerId == userId? "win" : "loss"}> */}
					<hr></hr>
						{`${last10Games[resultId].user1Name} vs ${last10Games[resultId].user2Name}:`}
						<br />
						{`${last10Games[resultId].scoreUser1} - ${last10Games[resultId].scoreUser2}`}
					{/* // </div>} */}
					</>}
				</> : <p>No games played yet</p>
				}
			</div>
	</>);
}

//todo: Carien: I (Jorien) don't get any match results. are they being sent already? I think this should be able to display them
export default function MatchHistory({user} : {user: UserProfileDto}) : JSX.Element {
	const {data: last10Games, isLoading, error, fetcher} = useFetch<null, GameResultDto[]>();

	useEffect(() => {
		fetchStats();
	}, []);

	const fetchStats = async () => {
		await fetcher({url: constants.API_LAST_10 + user.id});
	};

	return (
		<>
			<H3 text="Match History" />
			{last10Games != null?
			<div className="text-center">
				{last10Games.map((last10Games: GameResultDto) => {
					return (
						<div key={last10Games.id} className='id'>
							<hr></hr>
							{`${last10Games.user1Name} vs ${last10Games.user2Name}:`}
							<br />
							<div className={last10Games.winnerId == user.id? "win" : "loss"}>
							{`${last10Games.scoreUser1} - ${last10Games.scoreUser2}`}
							</div>
						</div>
					);
				})}
			</div> : <p>No stats found</p>}
		</>
	);
}
