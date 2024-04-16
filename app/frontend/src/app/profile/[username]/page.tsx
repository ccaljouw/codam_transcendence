"use client";
import UserInfo from "./components/UserInfo.tsx";
import Stats from "./components/Stats.tsx";
import MatchHistory from "./components/MatchHistory.tsx";
import GameSettings from "./components/GameSettings.tsx";
import LoginSettings from "./components/LoginSettings.tsx";
import Blocked from "./components/Blocked.tsx";
import { H3 } from '@ft_global/layoutComponents/Font';
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import useFetch from "src/globals/functionComponents/useFetch.tsx";
import { UserProfileDto } from "@ft_dto/users/user-profile.dto.ts";
import { constants } from "src/globals/constants.globalvar.tsx";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar.tsx";

export default function Page({params} : {params: {username: string}}) : JSX.Element {
	const {currentUser} = useContext(TranscendenceContext);
	const {data: user, isLoading, error, fetcher} = useFetch<null, UserProfileDto>();
	const pathname = usePathname();
	
	useEffect(() => {
		console.log(pathname);
		if (pathname != `/profile/${params.username}`)
			console.log("pathname has to be updated"); //todo: JMA: update pathname
		fetchUser();
	}, []);

	const fetchUser = async () => {
		await fetcher({url: constants.API_USERS + params.username});
	};

	return (
		<>
			{isLoading && 
				<H3>Loading profile page of {params.username}...</H3>
			}
			{error != null &&
				<H3>Oops, it seems that the user {params.username} does not exist...</H3>
			}
			{user != null && 
				<>
					<H3>Profile page of {params.username}</H3>  
					<div className="row">
						<p>The information below is public:</p>
						<div className="col col-lg-4 col-md-6 col-12 white-box">
							<UserInfo user={user}/>
						</div>
						<div className="col col-lg-4 col-md-6 col-12 white-box">
							<Stats user={user}/>
						</div>
						<div className="col col-lg-4 col-md-6 col-12 white-box">
							<MatchHistory user={user}/>
						</div>
					</div>
					{user.userName == currentUser.userName &&
						<div className="row">
							<p>The information below is only visible to you:</p>
							<div className="col col-lg-4 col-md-6 col-12 white-box">
								<GameSettings user={user}/>
							</div>
							<div className="col col-lg-4 col-md-6 col-12 white-box">
								<LoginSettings user={user}/>
							</div>
							<div className="col col-lg-4 col-md-6 col-12 white-box">
								<Blocked user={user}/>
							</div>
						</div>
					}
				</>
			}
		</>
	);
}
