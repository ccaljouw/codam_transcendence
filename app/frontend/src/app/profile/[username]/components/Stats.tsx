import { UserProfileDto } from "@ft_dto/users";
import { H3 } from 'src/globals/layoutComponents/Font';
import StaticDataField from "src/app/profile/[username]/components/utils/StaticDataField";
import Achievements from "./utils/Achievements";

export default function Stats({user} : {user: UserProfileDto}) : JSX.Element {
    const testAchievements= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    //todo: Jorien: I (Carien) do not understand enough to change this to use the correct api.
    // I think all field below can be filled with data from the API_STATS endpoint

    return (
        <>
            <H3 text="statistics"/>
            <StaticDataField name="Rank" data={"#" + user.rank} />
            <StaticDataField name="Win/Loss Ratio " data="1.0" />
            {user.friends != null &&
                <StaticDataField name="Friends" data={user.friends.length} />
            }
            <hr></hr>
            <Achievements achievements={testAchievements}/>
        </>
    );
}

// todo: get actual information from database for win/loss ratio