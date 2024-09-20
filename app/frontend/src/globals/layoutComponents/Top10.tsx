"use client";
import { useContext, useEffect } from "react";
import useFetch from "src/globals/functionComponents/useFetch";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar";

export default function Top10({url} : {url: string}) : JSX.Element {
	const {data, isLoading, error, fetcher} = useFetch<null, string[]>();
	const {currentUser} = useContext(TranscendenceContext);

	useEffect(() => {
		fetch();
	}, [url]);

	async function fetch(){
		await fetcher({url: url});
	}

	return (
		<>
			{data != null &&
				data.map((userName, index) => (
					<p key={index}>
						{userName === currentUser.userName ? <b>#{index + 1} {userName}</b> : `#${index + 1} ${userName}`}
					</p>
				))
			}
			{isLoading == true && <p>Loading...</p>}
			{error != null && <p>Error: {error.message}</p>}
		</>
	);
}
