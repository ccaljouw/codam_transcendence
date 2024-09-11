import Welcome from "./components/Welcome.tsx";
import { H3 } from "src/globals/layoutComponents/Font.tsx";
import Top10 from "src/globals/layoutComponents/Top10.tsx";
import { constants } from "src/globals/constants.globalvar.tsx";
import {Suspense} from 'react';

export default function Page() : JSX.Element {
	return (
		<>
			<div>
							<p>Hoi</p>
				<div className="row">
						<Suspense fallback={<div>Loading leaderboard...</div>}>
					<div className="col col-4 white-box">
						<Welcome/>
					</div>
					<div className="col col-4 white-box">
						<H3 text="Leaderboard"/>
							<Top10 url={constants.API_RANK_TOP_10}/>
						{/* </Suspense> */}
					</div>
					<div className="col col-4 white-box">
						<H3 text="Ladder"/>
						{/* <Suspense fallback={<div>Loading ladder...</div>}> */}
							<Top10 url={constants.API_LADDER_TOP_10}/>
					</div>
						</Suspense>
				</div>
			</div>
		</>
	);
}
