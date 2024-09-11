import Link from 'next/link';
import { H3 } from 'src/globals/layoutComponents/Font';
import { Suspense } from 'react';

export default function RandomMatchButton() : JSX.Element {
	return (
		<>
			<div className="white-box text-center">
				{/* <Suspense fallback="loading wait page..."> */}
				<H3 text="strongpong"/>

				<img src="http://localhost:3001/avatar/favicon.ico"/>
				<H3 text="play a match"/>
				<br/>
				<Link className="btn btn-dark" href="/game/0">Random Match</Link>
				<br/>
				<H3 text="or"/>
				<Link className="btn btn-dark" href="/game/-1">Practice Game</Link>
				{/* </Suspense> */}
			</div>
		</>
	);
}
