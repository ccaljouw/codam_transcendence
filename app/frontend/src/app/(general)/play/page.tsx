import Link from 'next/link';
import { H3 } from 'src/globals/layoutComponents/Font';
import { constants } from 'src/globals/constants.globalvar';

export default function Page() : JSX.Element {
	return (
		<>
			<div className="white-box text-center">
			<H3 text="strongpong"/>
			<img src={constants.API_AVATAR + 'favicon.ico'} />
			<H3 text="play a match"/>
			<br/>
			<Link className="btn btn-dark" href="/game/0">Random Match</Link>
			<br/>
			<H3 text="or"/>
			<Link className="btn btn-dark" href="/game/-1">Practice Game</Link>
			</div>
		</>
	);
}
