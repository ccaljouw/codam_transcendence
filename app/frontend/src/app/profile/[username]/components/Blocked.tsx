import { UserProfileDto } from '@ft_dto/users';
import { FontBangers } from 'src/globals/layoutComponents/Font';

export default function Blocked({user} : {user: UserProfileDto}) : JSX.Element {
	return (
        <>
            <FontBangers>
                <h3>Blocked people</h3>
            </FontBangers>
            <p>This will probably be removed from the profile page</p>
            <p>This element is closed by default and can be opened to see the people you blocked</p>
        </>
	);
}
