"use client";
import { FormEvent, useContext, useEffect } from 'react';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import StaticDataField from 'src/app/profile/[username]/components/utils/StaticDataField';
import EditableDataField from 'src/app/profile/[username]/components/utils/EditableDataField';
import { H3 } from 'src/globals/layoutComponents/Font';
import { UpdateUserDto, UserProfileDto } from '@ft_dto/users';
import { constants } from '@ft_global/constants.globalvar';
import useFetch from 'src/globals/functionComponents/useFetch';
import FormToUpdateUserDto from 'src/globals/functionComponents/form/FormToUpdateUserDto';
import { optionalAttributes } from 'src/app/profile/[username]/components/utils/EditableDataField';

export default function UserInfo({user, editable} : {user: UserProfileDto, editable: boolean}): JSX.Element {
	const {currentUser, setCurrentUser} = useContext(TranscendenceContext);
	const {data: updatedUser, isLoading, error, fetcher} = useFetch<UpdateUserDto, UserProfileDto>();
	const usernameAttributes: optionalAttributes<string>={type:"text", data:user.userName, name:"userName", required:true, autoComplete:"off", minLength:3, maxLength:30};
	const firstnameAttributes: optionalAttributes<string>={type:"text", data:user.firstName, name:"firstName", required:true, autoComplete:"off", minLength:1, maxLength:30};
	const lastnameAttributes: optionalAttributes<string>={type:"text", data:user.lastName, name:"lastName", required:true, autoComplete:"off", minLength:1, maxLength:30};
	const emailAttributes: optionalAttributes<string>={type:"email", data:user.email, name:"email", required:true, autoComplete:"on"};
	const hashAttributes: optionalAttributes<string>={type:"password", data:"********", name:"hash", required:true, autoComplete:"off", minLength:3, maxLength:30};
	
	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		console.log("submitting form field entry");
		event.preventDefault();
		await fetcher({url: constants.API_USERS + currentUser.id, fetchMethod: 'PATCH', payload: FormToUpdateUserDto(event)})
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
			<StaticDataField name="Avatar" data={user.avatarId} />
			{editable == false && <StaticDataField name="Username" data={user.userName}/>}
			{editable == true && 
				<form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
					<EditableDataField name="Username" data={user.userName} attributes={usernameAttributes}/>
				</form>
			}
			<StaticDataField name="Online" data={user.online} /> 
			<StaticDataField name="Rank" data={"#" + user.rank} />

			{editable == true && user.userName == currentUser.userName && <>
				<hr></hr>
				<form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
					<EditableDataField name="First name" data={user.firstName} attributes={firstnameAttributes}/>
				</form>
				<form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
					<EditableDataField name="Last name" data={user.lastName} attributes={lastnameAttributes}/>
				</form>
				<form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
					<EditableDataField name="Email" data={user.email} attributes={emailAttributes}/>
				</form>
				<hr></hr>
				<form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
					<EditableDataField name="Password" data="********" attributes={hashAttributes}/> 
				</form>
				<button className="btn btn-outline-dark">Enable 2FA</button>
				<button className="btn btn-outline-dark">Change password</button>
			</>}
			{isLoading == true && <p>Updating userName...</p>}
			{error != null && <p>Not possible to update userName: {error.message}</p>}
		</>
	);
}

//todo: 2FA, change password