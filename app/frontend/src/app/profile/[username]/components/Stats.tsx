import { UserProfileDto } from "@ft_dto/users";
import StaticDataField from "src/app/profile/[username]/components/utils/StaticDataField";
import { FontBangers } from 'src/globals/layoutComponents/Font';

export default function Stats({user} : {user: UserProfileDto}) : JSX.Element {
    return (
        <>
            <FontBangers>
                <h3>User stats </h3>
            </FontBangers>
            <p>Not from database yet:</p>
            <StaticDataField name="Friends" data="12" />
            <StaticDataField name="Win/Loss ratio" data="1.0" />
            <StaticDataField name="Achievements" data="Noob, Diehard, 3 Wins in a row, own goal" />
        </>
    );
}

//todo: get actual information from database