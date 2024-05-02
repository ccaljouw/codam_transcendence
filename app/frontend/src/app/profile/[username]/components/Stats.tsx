import { UserProfileDto } from "@ft_dto/users";
import { H3 } from 'src/globals/layoutComponents/Font';
import StaticDataField from "src/app/profile/[username]/components/utils/StaticDataField";
import Achievements from "./utils/Achievements";

export default function Stats({user} : {user: UserProfileDto}) : JSX.Element {
    const testAchievements= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    return (
        <>
            <H3 text="User stats"/>
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

// todo: get actual information from database