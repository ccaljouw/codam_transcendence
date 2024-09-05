import { UserProfileDto } from "@ft_dto/users";
import { H3 } from '@ft_global/layoutComponents/Font';
import StaticDataField from "src/app/(general)/profile/[username]/components/utils/StaticDataField";
import Achievements from "./Achievements";
import { useEffect } from "react";
import useFetch from "@ft_global/functionComponents/useFetch";
import { constants } from "@ft_global/constants.globalvar";
import { StatsDto } from "@ft_dto/stats";

export default function Stats({user} : {user: UserProfileDto}) : JSX.Element {
    const {data: stats, isLoading, error, fetcher} = useFetch<null, StatsDto>();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
		await fetcher({url: constants.API_STATS + user.id});
	};

    return (
        <>
            <H3 text="statistics"/>
            <StaticDataField name="Rank" data={stats?.rank}/>
            <StaticDataField name="Win/Loss Ratio " data={stats?.winLossRatio} />
            {user.friends != null &&
                <StaticDataField name="Friends" data={stats?.friends} />
            }
            <hr></hr>
            <Achievements achievements={stats?.achievements}/>
        </>
    );
}
