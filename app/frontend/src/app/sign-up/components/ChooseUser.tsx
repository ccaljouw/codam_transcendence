"use client";
import UserList from 'src/components/UserList';
import { UserProfileDto } from '../../../../../backend/src/users/dto/user-profile.dto';

export default function ChooseUser({setCurrentUserId, setCurrentUserName}:{setCurrentUserId: any, setCurrentUserName: any}) { //todo: change type

	const setConnectionStatus = (user: UserProfileDto) => {
		console.log("I should do something with my connection status");
		sessionStorage.setItem('loginName', user.loginName); 
		sessionStorage.setItem('userId', user.id.toString());
		setCurrentUserId(user.id); 
		setCurrentUserName(user.loginName);
		console.log(`User set to ${user.id}`)
	}

	const setCurrentUserDisplayFunc = (user: UserProfileDto) => {
		return (
			<li key={user.id} onClick={() => { setConnectionStatus(user);   }}>
				{user.firstName} {user.lastName} - {user.email}
			</li>
		)
	}

	return (
		<>
			<UserList userDisplayFunction={setCurrentUserDisplayFunc} />
		</>
	);
}
