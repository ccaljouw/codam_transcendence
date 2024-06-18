import { UserProfileDto } from '@ft_dto/users';
import { useEffect } from 'react';
import { constants } from 'src/globals/constants.globalvar';
import useFetch from 'src/globals/functionComponents/useFetch';
import { H3 } from 'src/globals/layoutComponents/Font';

export default function MatchHistory({user} : {user: UserProfileDto}) : JSX.Element {
    // const {data: stats, isLoading, error, fetcher} = useFetch<null, StatsDto>();

    // useEffect(() => {
    //     fetchStats();
    // }, []);

    // const fetchStats = async () => {
	// 	await fetcher({url: constants.API_STATS + user.id});
	// };

    return (
        <>
            <H3 text="Match History" />
            <p>Not from database yet:</p>
            <p>Last (x amount of?) played matches</p>
        </>
    );
}
