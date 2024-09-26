import Welcome from "./components/Welcome.tsx";
import { H3 } from "src/globals/layoutComponents/Font.tsx";
import Top10 from "src/globals/layoutComponents/Top10.tsx";
import { constants } from "src/globals/constants.globalvar.tsx";

export default function Page() : JSX.Element {
	return (
		<>
			<div>
				<div className="row">
					<div className="col col-lg-4 col-md-12 white-box">
						<Welcome/>
					</div>
					<div className="col col-lg-4 col-md-12 white-box">
						<H3 text="Leaderboard"/>
						<Top10 url={constants.API_RANK_TOP_10}/>
					</div>
					<div className="col col-lg-4 col-md-12 white-box">
						<H3 text="Ladder"/>
						<Top10 url={constants.API_LADDER_TOP_10}/>
					</div>
				</div>
			</div>
		</>
	);
}
