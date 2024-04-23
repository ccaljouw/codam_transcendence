import { UserProfileDto } from "@ft_dto/users";
import DataField from "@ft_global/functionComponents/DataField";
import { FontBangers } from 'src/globals/layoutComponents/Font';

export default function Stats({user} : {user: UserProfileDto}) : JSX.Element {
    return (
        <>
            <FontBangers>
                <h3>User stats </h3>
            </FontBangers>
            <p>Not from database yet:</p>
            <DataField name="Friends" data="12" />
            <DataField name="Win/Loss ratio" data="1.0" />
            <DataField name="Achievements" data="Noob, Diehard, 3 Wins in a row, own goal" />
        </>
    );
}

//todo: get actual information from database