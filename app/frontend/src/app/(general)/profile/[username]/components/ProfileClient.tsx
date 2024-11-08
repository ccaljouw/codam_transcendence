"use client";
import UserInfo from "./UserInfo.tsx";
import Stats from "./Stats.tsx";
import MatchHistory from "./MatchHistory.tsx";
import GameSettings from "./GameSettings.tsx";
import { H3 } from '@ft_global/layoutComponents/Font';
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import useFetch from "src/globals/functionComponents/useFetch.tsx";
import { UserProfileDto } from "@ft_dto/users/user-profile.dto.ts";
import { constants } from "src/globals/constants.globalvar.tsx";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar.tsx";

export default function ProfileClient({userName} : {userName : string}) : JSX.Element {
	const {currentUser} = useContext(TranscendenceContext);
	const {data, isLoading, error, fetcher} = useFetch<null, UserProfileDto>();
	const pathname = usePathname();
	const [user, setUser] = useState<UserProfileDto | null>(null);
	
	useEffect(() => {
		console.log(pathname);
	}, []);

	useEffect(() => {
		if(userName == currentUser.userName) 
			setUser(currentUser);
		else
			fetchUser();
	}, [currentUser]);

	useEffect(() => {
		if(data != null)
			setUser(data);
	}, [data]);

	const fetchUser = async () => {
		await fetcher({url: `${constants.API_USERS}username/${userName}`});
	};

	return (
		<>
			{isLoading && 
				<H3 text={`Loading profile page of ${userName}...`}/>
			}
			{error != null &&
				<H3 text={`Oops, it seems that the user ${userName} does not exist: ${error.message}`}/>
			}
			{(user != null && user.userName != null) ? 
				<>
					<div className="white-box">
						<H3 text={`Profile page of ${user.userName}`} />
					</div>
					<div className="row">
						<div className="col col-lg-6 col-md-12 white-box">
							<UserInfo user={user} editable={user.userName == currentUser.userName}/>
						</div>
						<div className="col col-lg-6 col-md-12 white-box">
							<Stats user={user}/>
						</div>
						<div className="col col-lg-6 col-md-12 white-box">
							<MatchHistory user={user}/>
						</div>
					</div>
					{user.userName == currentUser.userName &&
						<div className="row">
							<div className="col col-lg-6 col-md-12 white-box">
								<GameSettings/>
							</div>
						</div>
					}
				</> : <><p> User not found...</p></>
			}
		</>
	);
}
