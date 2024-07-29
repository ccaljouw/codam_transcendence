import Link from 'next/link';
import { H3 } from 'src/globals/layoutComponents/Font';

export default function RandomMatchButton() : JSX.Element {
	return (
		<>
			<div className="white-box text-center">
				<H3 text="strongpong"/>
				<img src="favicon.ico"/>
				<H3 text="play a match"/>
				<br/>
				<Link className="btn btn-dark" href="/game/0">Random Match</Link>
			</div>
		</>
	);
}
