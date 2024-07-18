"use client";
import { FormEvent, useContext, useEffect, useState } from 'react';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import StaticDataField from 'src/app/profile/[username]/components/utils/StaticDataField';
import EditableDataField from 'src/app/profile/[username]/components/utils/EditableDataField';
import { H3 } from 'src/globals/layoutComponents/Font';
import { UpdateUserDto, UserProfileDto } from '@ft_dto/users';
import { CheckTokenDto, UpdatePwdDto } from '@ft_dto/authentication'
import { constants } from '@ft_global/constants.globalvar';
import useFetch from 'src/globals/functionComponents/useFetch';
import FormToUpdateUserDto from 'src/globals/functionComponents/form/FormToUpdateUserDto';
import { optionalAttributes } from 'src/app/profile/[username]/components/utils/EditableDataField';

export default function UserInfo({user, editable} : {user: UserProfileDto, editable: boolean}): JSX.Element {
	const {currentUser, setCurrentUser} = useContext(TranscendenceContext);
	const {data: updatedUser, isLoading: loadingUser, error: errorUser, fetcher: fetchUser} = useFetch<UpdateUserDto, UserProfileDto >();
  const {data: twoFA, isLoading: loading2FA, error: error2FA, fetcher: fetch2FA} = useFetch<null, { res: string } >();
  const {data: FAValid, isLoading: loadingFAValid, error: errorFAValid, fetcher: fetchFAValid} = useFetch<CheckTokenDto , boolean >();
  const {data: disable2FA, isLoading: loadingDisable2FA, error: errorDisable2FA, fetcher: fetchDisable2FA} = useFetch<null, boolean>();
  const {data: updatePwd, isLoading: loadingPwd, error: errorPwd, fetcher: fetchPwd} = useFetch<UpdatePwdDto, boolean>()
	const usernameAttributes: optionalAttributes={type:"text", name:"userName", required:true, autoComplete:"off", minLength:3, maxLength:30};
	const firstnameAttributes: optionalAttributes={type:"text", name:"firstName", required:true, autoComplete:"off", minLength:1, maxLength:30};
	const lastnameAttributes: optionalAttributes={type:"text", name:"lastName", required:true, autoComplete:"off", minLength:1, maxLength:30};
	const emailAttributes: optionalAttributes={type:"email", name:"email", required:true, autoComplete:"on"};
	const hashAttributes: optionalAttributes={type:"password", name:"pwd", required:true, autoComplete:"off", minLength:3, maxLength:30};

  const [token, setToken] = useState('');
  const [pwd, setPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [action2FA, setAction2FA] = useState<string>("Enable 2FA");
  const [changePassword, setChangePassword] = useState<string>("");
	
	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		console.log("submitting form field entry");
		event.preventDefault();
		await fetchUser({url: constants.API_USERS + currentUser.id, fetchMethod: 'PATCH', payload: FormToUpdateUserDto(event)})
	}

  const changePwdSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const updatePwdDto: UpdatePwdDto ={ 
      userId: currentUser.id,
      oldPwd: pwd,
      newPwd: newPwd
    }
		console.log(`submitting form field entry for pwd change, old pwd: ${pwd}, newpwd: ${newPwd}, id: ${currentUser.id}`);
		event.preventDefault();
		await fetchPwd({url: constants.API_CHANGEPWD, fetchMethod: 'PATCH', payload: updatePwdDto})
	}

  const enable2FA =  () => {
    if (!user.twoFactEnabled) {
      console.log('enabeling 2FA');
      fetch2FA({url: constants.API_ENABLE2FA + currentUser.id, fetchMethod: 'PATCH'});
      // currentUser.twoFactEnabled = true;
    }
    else {
      console.log("disable 2FA");
      fetchDisable2FA({ url: constants.API_DISABLE2FA + currentUser.id, fetchMethod: 'PATCH'});
      currentUser.twoFactEnabled = false;
    }
	}

  const checkToken = async (event: FormEvent<HTMLFormElement>) => {
		console.log("submitting created token");
		event.preventDefault();
    if (token) {
      console.log(`got token from form: ${token}`)
      try {
        await fetchFAValid({
          url: constants.API_CHECK2FATOKEN,
          fetchMethod: 'POST',
          payload: {  userId: currentUser.id, token}
        });
        if (FAValid == true) {
          console.log("setting 2FA to enabled");
          // TODO: the enable 2FA button is not updating correcty
          currentUser.twoFactEnabled = true;
        }
      } catch (error) {
        console.error('Invalid token failed:', error);
        throw error;
      }
    }
	}

  const changePwd = async () => {
		console.log("Change password");
    setChangePassword("setNewPwd");
		// await fetchUser({url: constants.API_CHANGEPWD, fetchMethod: 'PATCH', payload: })
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
				<button className="btn btn-outline-dark" onClick={enable2FA}>{currentUser.twoFactEnabled?   "Disable 2FA" : "Enable 2FA"}</button>
				<button className="btn btn-outline-dark" onClick={changePwd}>Change password</button>
			</>}
			{loadingUser == true && <p>Updating user...</p>}
			{errorUser != null && <p>Not possible to update user: {errorUser.message}</p>}

      {loading2FA == true && <p>Enabeling 2FA authentication... </p>}
      {error2FA != null && <p>Error enabeling 2FA: {error2FA.message}</p>}
      {twoFA && twoFA.res != '2FA already enabled' && FAValid == null &&
        <div style={{ textAlign: 'center' }}>
          <p>Please scan the QR code below with your authentication app and check the resulting token:</p>
          <img src={twoFA.res}/>
          <form onSubmit={checkToken} acceptCharset='utf-8' className="row">
            <input type="text" name="Token" value={token} onChange={(e) => setToken(e.target.value)} className="form-control" placeholder="Enter Token"/>
            <button className="btn btn-dark btn-sm" type="submit">Check Token</button>
        </form>
        </div> 
      }
      {twoFA && twoFA.res == '2FA already enabled' && 
        <p>Two factor authentication already enabled</p>
      }
      {FAValid != null && <p>Two factor authentication successfully enabled</p>}
      {errorFAValid != null && <p>Error checking token: {errorFAValid.message}</p>}

      {changePassword == "setNewPwd" && <>
        <form onSubmit={changePwdSubmit} acceptCharset='utf-8' className="row">
          <input  type="text" name="Old password"
                  value={pwd} onChange={(e) => setPwd(e.target.value)} className="form-control" 
                  placeholder="Enter old password"/>
          <input  type="text" name="New password" 
                  value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="form-control" 
                  placeholder="Enter new password"/>
          <button className="btn btn-dark btn-sm" type="submit">Submit new password</button>
        </form>
      </>
      }
      {errorPwd && <p>Not possible to change password: {errorPwd.message}</p>}
		</>
	);
}

//todo: 2FA, change password