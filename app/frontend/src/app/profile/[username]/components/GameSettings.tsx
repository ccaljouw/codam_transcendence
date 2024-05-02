import { UserProfileDto } from '@ft_dto/users';
import { FontBangers } from 'src/globals/layoutComponents/Font';

export default function GameSettings({user} : {user: UserProfileDto}) : JSX.Element {
	return (
        <>
            <FontBangers>
                <h3>Game settings</h3>
            </FontBangers>
            <p>This might not be needed anymore and will be removed(?)</p>
            <p>Color preference: default</p>
        </>
	);
}
