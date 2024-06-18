import { StatsDto } from '@ft_dto/stats';
import { UserProfileDto } from '@ft_dto/users';
import { useEffect } from 'react';
import { constants } from 'src/globals/constants.globalvar';
import useFetch from 'src/globals/functionComponents/useFetch';
import { H3 } from 'src/globals/layoutComponents/Font';

//todo: Carien: I (Jorien) don't get any match results. are they being sent already? I think this should be able to display them
export default function MatchHistory({user} : {user: UserProfileDto}) : JSX.Element {
	const {data: stats, isLoading, error, fetcher} = useFetch<null, StatsDto>();

	useEffect(() => {
		fetchStats();
	}, []);

	const fetchStats = async () => {
		await fetcher({url: constants.API_STATS + user.id});
	};

	return (
		<>
			<H3 text="Match History" />
			{stats != null && 
				<>
					{stats.last10Games != null ? 
						<>
							{stats.last10Games[0]}
							{stats.last10Games[1]}
							{stats.last10Games[2]}
							{stats.last10Games[3]}
							{stats.last10Games[4]}
							{stats.last10Games[5]}
							{stats.last10Games[6]}
							{stats.last10Games[7]}
							{stats.last10Games[8]}
							{stats.last10Games[9]}
							{stats.last10Games[10]}
						</> : <p>Last 10 games is null</p>
					}
				</>
			}
			{stats == null &&  <p>No stats found</p>}
		</>
	);
}
