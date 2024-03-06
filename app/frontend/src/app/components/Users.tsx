import { UserProfileDto } from "../../../../backend/src/users/dto/user-profile.dto";
import DataFetcher from "src/components/DataFetcherMarkup";

export default function Users() {
	return (
        <div className="text-center">
			<h1>Users</h1>
			<DataFetcher<UserProfileDto[]>
				url='http://localhost:3001/users/all'
				renderData={(data) => {
					if (!data || !Array.isArray(data)) {
						return <p>Error: Invalid data format</p>;
					}
			
					return (
						<div>
							{data.map((user) => (
								<div key={user.id}>
									<p>{user.userName} {user.firstName}: {user.id}</p>
								</div>
							))}
						</div>
					);
				}}
			/>
        </div>
	);
}
