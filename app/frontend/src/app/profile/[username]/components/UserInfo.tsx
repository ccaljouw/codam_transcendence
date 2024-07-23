"use client";
import { FormEvent, useContext, useEffect, useState } from 'react';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import StaticDataField from 'src/app/profile/[username]/components/utils/StaticDataField';
import EditableDataField from 'src/app/profile/[username]/components/utils/EditableDataField';
import { H3 } from 'src/globals/layoutComponents/Font';
import { UpdateUserDto, UserProfileDto } from '@ft_dto/users';
import { constants } from '@ft_global/constants.globalvar';
import useFetch from 'src/globals/functionComponents/useFetch';
import FormToUpdateUserDto from 'src/globals/functionComponents/form/FormToUpdateUserDto';
import { optionalAttributes } from 'src/app/profile/[username]/components/utils/EditableDataField';
import Avatar from 'src/app/profile/[username]/components/Avatar';
import TwoFactorAuthentication from './TwoFactorAuthentication';
import ChangePassword from './ChangePassword';

export default function UserInfo({user, editable} : {user: UserProfileDto, editable: boolean}): JSX.Element {
	const {currentUser, setCurrentUser} = useContext(TranscendenceContext);
	const {data: updatedUser, isLoading: loadingUser, error: errorUser, fetcher: fetchUser} = useFetch<UpdateUserDto, UserProfileDto >();
	const usernameAttributes: optionalAttributes={type:"text", name:"userName", required:true, autoComplete:"off", minLength:3, maxLength:30};
	const firstnameAttributes: optionalAttributes={type:"text", name:"firstName", required:true, autoComplete:"off", minLength:1, maxLength:30};
	const lastnameAttributes: optionalAttributes={type:"text", name:"lastName", required:true, autoComplete:"off", minLength:1, maxLength:30};
	const emailAttributes: optionalAttributes={type:"email", name:"email", required:true, autoComplete:"on"};
	const hashAttributes: optionalAttributes={type:"password", name:"pwd", required:true, autoComplete:"off", minLength:3, maxLength:30};
	
	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		console.log("submitting form field entry");
		event.preventDefault();
		await fetchUser({url: constants.API_USERS + currentUser.id, fetchMethod: 'PATCH', payload: FormToUpdateUserDto(event)})
	}
  
	useEffect(() => {
    if (updatedUser != null)
      {
        setCurrentUser(updatedUser);
        console.log("reload page from userInfo");
      }
	}, [updatedUser]);

	return (
		<>
			<H3 text="User information"/>
      {editable == false && <Avatar user={user} editable={false}/>}
      {editable == true && <Avatar user={user} editable={true}/>}
			{editable == false && <StaticDataField name="Username" data={user.userName}/>}
			{editable == true && 
				<form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
					<EditableDataField name="Username" data={user.userName} attributes={usernameAttributes}/>
				</form>
			}
			<StaticDataField name="Online" data={user.online} /> 

			{editable == true && user.userName == currentUser.userName && <>
				<form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
					<EditableDataField name="First name" data={user.firstName} attributes={firstnameAttributes}/>
				</form>
				<form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
					<EditableDataField name="Last name" data={user.lastName} attributes={lastnameAttributes}/>
				</form>
				<form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
					<EditableDataField name="Email" data={user.email} attributes={emailAttributes}/>
				</form>
        <ChangePassword/>
				<hr></hr>
        <TwoFactorAuthentication/>
			</>}
			{loadingUser == true && <p>Updating user...</p>}
			{errorUser != null && <p>Not possible to update user: {errorUser.message}</p>}
		</>
	);
}

//todo: 2FA, change password