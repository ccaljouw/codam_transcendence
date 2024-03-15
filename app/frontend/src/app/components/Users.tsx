"use client";
import { useEffect } from "react";
import { UserProfileDto } from "@dto/users";
import { constants } from "@global/constants.globalvar";
import useFetch from '@global/functionComponents/useFetch';

export default function Users() : JSX.Element {
	const {data:users, isLoading, error, fetcher} = useFetch<null, UserProfileDto[]>();

	useEffect (() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		await fetcher({url: constants.API_ALL_USERS});
	}

	return (
        <div className="text-center">
			<h1>Users</h1>
			{isLoading && <p>Loading...</p>}
			{error != null && <p>Error: {error.message}</p> }
			{(users != null && users.length > 0 && 
				<div>
					{users.map((user) => (
						<div key={user.id}>
							<p>{user.userName} {user.firstName}: {user.id}</p>
						</div>
					))}
				</div>
			)}
        </div>
	);
}
