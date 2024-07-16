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

export default function UserInfo({user, editable} : {user: UserProfileDto, editable: boolean}): JSX.Element {
	const {currentUser, setCurrentUser} = useContext(TranscendenceContext);
	const {data: updatedUser, isLoading: loadingUser, error: errorUser, fetcher: fetchUser} = useFetch<UpdateUserDto, UserProfileDto >();
  const {data: twoFA, isLoading: loading2FA, error: error2FA, fetcher: fetch2FA} = useFetch<null, { res: string } >();
  const {data: FAValid, isLoading: loadingFAValid, error: errorFAValid, fetcher: fetchFAValid} = useFetch<string, boolean >();
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

  const enable2FA =  () => {
		console.log('enabeling 2FA');
    fetch2FA({url: constants.API_ENABLE2FA + currentUser.id, fetchMethod: 'PATCH'})
	}

  const checkToken = async (event: FormEvent<HTMLFormElement>) => {
		console.log("submitting created token");
		event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get("Token authenticator app")) {
      const token = formData.get("Token authenticator app")?.toString();
      try {
        await fetchFAValid({
          url: constants.API_USERS + currentUser.id,
          fetchMethod: 'POST',
          payload: token
        });
      } catch (error) {
        console.error('Invalid token failed:', error);
        throw error;
      }
    }
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
				<button className="btn btn-outline-dark" onClick={enable2FA}>Enable 2FA</button>
				<button className="btn btn-outline-dark">Change password</button>
			</>}
			{loadingUser == true && <p>Updating user...</p>}
			{errorUser != null && <p>Not possible to update user: {errorUser.message}</p>}

      {FAValid != null && <p>Checked token</p>}
      {errorFAValid != null && <p>Error checking token: {errorFAValid.message}</p>}

      {loading2FA == true && <p>Enabeling 2FA authentication... </p>}
      {error2FA != null && <p>Error enabeling 2FA: {error2FA.message}</p>}
      {twoFA && twoFA.res != '2FA already enabled' &&
        <div style={{ textAlign: 'center' }}>
          <p>Please scan the QR code below with your authentication app and check the resulting token:</p>
          <img src={twoFA.res}/>
          <form onSubmit={checkToken} acceptCharset='utf-8' className="row">
            <input id="Token" type="Token" required={true} className="form-control form-control-sm"></input>
            <button className="btn btn-dark btn-sm" type="submit">Check Token</button>
				</form>
        </div> 
      }
      {twoFA && twoFA.res == '2FA already enabled' && 
        <p>Two factor authentication already enabled</p>
      }
		</>
	);
}

//todo: 2FA, change password