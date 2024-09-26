import { UserProfileDto } from "@ft_dto/users";


//
// we could add these as a method to the UserProfileDto class
//

export const IsFriend = (idToTest: number, user : UserProfileDto) : boolean => {
	if (!user || !user.friends)
		return false;
	for (const friend of user.friends as UserProfileDto[]) {
		// console.log("checking friend", friend.id, idToTest);
		if (friend.id === idToTest) {
			return true;
		}
	}
	return false;
}

export const IsBlocked = (idToTest: number, user : UserProfileDto) : boolean => {
	if (!user.blocked)
		return false;
	for (const blocked of user.blocked as UserProfileDto[]) {
		if (blocked.id === idToTest) {
			return true;
		}
	}
	return false;
}

export const HasFriends = (user : UserProfileDto) : boolean => {
	if (!user.friends)
		return false;
	return user.friends.length > 0;
}
