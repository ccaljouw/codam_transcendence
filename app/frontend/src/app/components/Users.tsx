"use client";
import { useEffect } from "react";
import { UserProfileDto } from "@ft_dto/users";
import { constants } from "@ft_global/constants.globalvar";
import useFetch from '@ft_global/functionComponents/useFetch';
import UserLink from "src/globals/layoutComponents/UserLink/UserLink";

export default function Users() : JSX.Element {
	const {data:users, isLoading, error, fetcher} = useFetch<null, UserProfileDto[]>();

	useEffect (() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		//todo: call this function again after blocking a user
		await fetcher({url: constants.API_ALL_USERS}); //todo: fetch only the non-blocked users
	}

	return (
        <div className="text-center">
			<h1>Users</h1>
			{isLoading && <p>Loading...</p>}
			{error != null && <p>Error: {error.message}</p> }
			{(users != null && users.length > 0 && 
				<div>
					{users.map((user) => (
						<>
							<UserLink id={user.id} userName={user.userName}/>
						</>
					))}
				</div>
			)}
        </div>
	);
}
