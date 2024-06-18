import { UserProfileDto } from "@ft_dto/users";
import { H3 } from '@ft_global/layoutComponents/Font';
import StaticDataField from "src/app/profile/[username]/components/utils/StaticDataField";
import Achievements from "./utils/Achievements";
import { useEffect } from "react";
import useFetch from "@ft_global/functionComponents/useFetch";
import { constants } from "src/globals/constants.globalvar";
import { StatsDto } from "@ft_dto/stats";

export default function Stats({user} : {user: UserProfileDto}) : JSX.Element {
    const {data: stats, isLoading, error, fetcher} = useFetch<null, StatsDto>();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
		await fetcher({url: constants.API_STATS + user.id});
	};

    const testAchievements= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    //todo: Jorien: I (Carien) do not understand enough to change this to use the correct api.
    // I think all field below can be filled with data from the API_STATS endpoint

    return (
            // : ${isLoading == null? "loading..." : ${error != null: error}}}`} />
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

// todo: get actual information from database for win/loss ratio
