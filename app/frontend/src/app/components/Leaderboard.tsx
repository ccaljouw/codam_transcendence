"use client";
import { useEffect } from "react";
import { H3 } from "src/globals/layoutComponents/Font";
import { UserProfileDto } from "@ft_dto/users";
import { constants } from "src/globals/constants.globalvar";
import useFetch from "src/globals/functionComponents/useFetch";

export default function Leaderboard() : JSX.Element {
	const {data:leaderboard, isLoading, error, fetcher:leaderboardFetcher} = useFetch<null, string[]>();

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
					<p><b>#1 {leaderboard[0]}</b></p>
					<p>#2 {leaderboard[1]}</p>
					<p>#3 {leaderboard[2]}</p>
					<p>#4 {leaderboard[3]}</p>
					<p>#5 {leaderboard[4]}</p>
					<p>#6 {leaderboard[5]}</p>
					<p>#7 {leaderboard[6]}</p>
					<p>#8 {leaderboard[7]}</p>
					<p>#9 {leaderboard[8]}</p>
					<p>#10 {leaderboard[9]}</p>
				</>
			}
			{isLoading && <p>Loading Peaderboard...</p>}
			{error != null && <p>Error: can't load leaderboard: {error.message}</p>}
		</>
	);
}
