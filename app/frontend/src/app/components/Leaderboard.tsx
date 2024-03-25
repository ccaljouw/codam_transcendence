import { FontBangers } from "src/globals/layoutComponents/Font";

export default function Leaderboard() : JSX.Element {
	return (
		<>
			<div className="text-center">
				<FontBangers>
					<h1>Leaderboard</h1>
				</FontBangers>
				<p>Jaberkro<br/>Jaberkro2<br/>TranscendenceTesters<br/></p>
			</div>
		</>
	);
}

//todo: JMA: use generic data fetcher to create leaderboard. 