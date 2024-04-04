import { FontBangers } from 'src/globals/layoutComponents/Font';

export default function Blocked() : JSX.Element {
	return (
        <>
            <FontBangers>
                <h3>Blocked people</h3>
            </FontBangers>
            <p>Not from database yet:</p>
            <p>This element is closed by default and can be opened to see the people you blocked</p>
        </>
	);
}
