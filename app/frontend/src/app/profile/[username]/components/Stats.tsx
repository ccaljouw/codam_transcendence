import { UserProfileDto } from "@ft_dto/users";
import StaticDataField from "src/app/profile/[username]/components/utils/StaticDataField";
import { FontBangers } from 'src/globals/layoutComponents/Font';
import Achievements from "./utils/Achievements";

export default function Stats({user} : {user: UserProfileDto}) : JSX.Element {
    const achievements= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    return (
        <>
            <FontBangers>
                <h3>User stats </h3>
            </FontBangers>
            <p>Not from database yet:</p>
            <StaticDataField name="Friends" data="12" />
            <hr></hr>
            <StaticDataField name="Win/Loss Ratio " data="1.0" />
            <hr></hr>
            <Achievements achievements={achievements}/>
        </>
    );
}

// todo: get actual information from database