"use client";
import { FormEvent, useContext, useEffect } from 'react';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import StaticDataField from 'src/app/(general)/profile/[username]/components/utils/StaticDataField';
import EditableDataField from 'src/app/(general)/profile/[username]/components/utils/EditableDataField';
import { H3 } from 'src/globals/layoutComponents/Font';
import { UpdateUserDto, UserProfileDto } from '@ft_dto/users';
import { constants } from '@ft_global/constants.globalvar';
import useFetch from 'src/globals/functionComponents/useFetch';
import FormToUpdateUserDto from 'src/globals/functionComponents/form/FormToUpdateUserDto';
import Avatar from 'src/app/(general)/profile/[username]/components/Avatar';
import TwoFactorAuthentication from './TwoFactorAuthentication';
import ChangePassword from './ChangePassword';
import { useRouter } from 'next/navigation';

export default function UserInfo({user, editable} : {user: UserProfileDto, editable: boolean}) : JSX.Element {
	const {currentUser, setCurrentUser} = useContext(TranscendenceContext);
	const {data: updatedUser, isLoading: loadingUser, error: errorUser, fetcher: fetchUser} = useFetch<UpdateUserDto, UserProfileDto>();
	// const {data: is42User, isLoading: loadingAuthMethod, error: errorAuthMethod, fetcher: fetchAuthMethod} = useFetch<null, boolean>();
	const router = useRouter();
	
	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		console.log("submitting form field entry");
		event.preventDefault();
		await fetchUser({url: constants.API_USERS + currentUser.id, fetchMethod: 'PATCH', payload: FormToUpdateUserDto(event)})
	}
	
	useEffect(() => {
		if (updatedUser != null)
			{
				if (currentUser.userName != updatedUser.userName)
				{
					console.log("It seems that the username has been changed");
					router.push(`/profile/${updatedUser.userName}`);
				}
				setCurrentUser(updatedUser);
				console.log("reload page from userInfo");
			}
	}, [updatedUser]);

	// useEffect(() => {
	// 	if (editable == true)
	// 	{
	// 		checkLoggedWithAuth42();
	// 	}
	// }, []);

	// const checkLoggedWithAuth42 = async () => {
	// 	await fetchAuthMethod({url: constants.API_42_USER + currentUser.id});
	// }

	return (
		<>
			<H3 text="User information"/>
			<Avatar user={user} editable={editable}/>
			<hr></hr>
			{editable == false && <StaticDataField name="Username" data={user.userName}/>}
			{editable == true && 
				<form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
					<EditableDataField name="Username" data={user.userName}>
						<input className="form-control form-control-sm" placeholder={user.userName} type="text" name="userName" required={true} autoComplete="off" minLength={4} maxLength={15}></input>
					</EditableDataField>
				</form>
			}
			<StaticDataField name="Online" data={user.online} /> 
			{editable == true && user.userName == currentUser.userName && <>
				<form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
					<EditableDataField name="First name" data={user.firstName}>
						<input className="form-control form-control-sm" placeholder={user.firstName} type="text" name="firstName" required={true} autoComplete="off" minLength={1} maxLength={15}></input>
					</EditableDataField>
				</form>
				<form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
					<EditableDataField name="Last name" data={user.lastName}>
						<input className="form-control form-control-sm" placeholder={user.lastName} type="text" name="lastName" required={true} autoComplete="off" minLength={1} maxLength={15}></input>
					</EditableDataField>
				</form>
				<form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
					<EditableDataField name="Email" data={user.email}>
						<input className="form-control form-control-sm" placeholder={user.email} type="email" name="email" required={true} autoComplete="on"></input>
					</EditableDataField>
				</form>
				<hr></hr>
				{/* {(is42User != null && is42User == false) && <> */}
					<ChangePassword/>
					<TwoFactorAuthentication/>
				{/* </>} */}
			</>}
			{loadingUser == true && <p>Updating user...</p>}
			{errorUser != null && <p>Not possible to update user: {errorUser.message}</p>}
		</>
	);
}
