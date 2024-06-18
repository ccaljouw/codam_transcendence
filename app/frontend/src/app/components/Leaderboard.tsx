"use client";
import { useEffect } from "react";
import { H3 } from "src/globals/layoutComponents/Font";
import { UserProfileDto } from "@ft_dto/users";
import { constants } from "src/globals/constants.globalvar";
import useFetch from "src/globals/functionComponents/useFetch";

export default function Leaderboard() : JSX.Element {
	const {data:leaderboard, isLoading, error, fetcher:leaderboardFetcher} = useFetch<null, UserProfileDto[]>();

	useEffect(() => {
		fetchLeaderboard();
	}, []);

	async function fetchLeaderboard(){
		await leaderboardFetcher({url:constants.API_TOP_10});
	}

	return (
		<>
			<H3 text="Leaderboard"/>
			{leaderboard != null && 
				<>
					<p>#1 {leaderboard[0]?.userName}</p>
					<p>#2 {leaderboard[1]?.userName}</p>
					<p>#3 {leaderboard[2]?.userName}</p>
					<p>#4 {leaderboard[3]?.userName}</p>
					<p>#5 {leaderboard[4]?.userName}</p>
					<p>#6 {leaderboard[5]?.userName}</p>
					<p>#7 {leaderboard[6]?.userName}</p>
					<p>#8 {leaderboard[7]?.userName}</p>
					<p>#9 {leaderboard[8]?.userName}</p>
					<p>#10 {leaderboard[9]?.userName}</p>
				</>
			}
			{isLoading && <p>Loading Peaderboard...</p>}
			{error != null && <p>Error: can't load leaderboard: {error.message}</p>}
		</>
	);
}

//todo: JMA: use generic data fetcher to create leaderboard. 