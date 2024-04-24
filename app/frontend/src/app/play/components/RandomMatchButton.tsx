import Link from 'next/link';
import { FontBangers } from 'src/globals/layoutComponents/Font';

export default function RandomMatchButton() : JSX.Element {
	return (
		<>
			<div className="pt-5 white-box text-center">
				<Link className="btn btn-dark" href="/game">Random Match</Link>
				<FontBangers>
					<h3 className="m-5">Cool picture</h3>
				</FontBangers>
			</div>
		</>
	);
}
