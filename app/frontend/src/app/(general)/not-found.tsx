import Link from 'next/link';
import { H3, FontPopArt } from '@ft_global/layoutComponents/Font.tsx';

export default function Page() {
	return (
		<div className="text-center white-box navbar not-found">
			<div className="col">

				<H3 text="Not Found"></H3>
				<p>Could not find requested resource</p>
				<div className="nav-link link-underline link-underline-opacity-0 link-dark">
					<FontPopArt>
						<Link href="/">Return&nbsp;&nbsp;Home</Link>
					</FontPopArt>
				</div>
			</div>
		</div>
	)
}
