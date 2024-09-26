import { GameResultDto } from '@ft_dto/stats';
import { UserProfileDto } from '@ft_dto/users';
import { useEffect } from 'react';
import { constants } from 'src/globals/constants.globalvar';
import useFetch from 'src/globals/functionComponents/useFetch';
import { H3 } from 'src/globals/layoutComponents/Font';

export default function MatchHistory({user} : {user: UserProfileDto}) : JSX.Element {
	const {data: last10Games, fetcher} = useFetch<null, GameResultDto[]>();

	useEffect(() => {
		fetchStats();
	}, []);

	const fetchStats = async () => {
		await fetcher({url: constants.API_LAST_10 + user.id});
	};

	return (
		<>
			<H3 text="Match History" />
			{last10Games != null && last10Games.length > 0?
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
				</div> : <p>No matches played yet</p>
			}
		</>
	);
}
