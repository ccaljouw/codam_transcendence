"use client";
import { FormEvent, useContext, useEffect, useState } from 'react';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { UpdatePwdDto } from '@ft_dto/authentication'
import { constants } from '@ft_global/constants.globalvar';
import useFetch from 'src/globals/functionComponents/useFetch';
import { optionalAttributes } from 'src/app/(general)/profile/[username]/components/utils/EditableDataField';

export default function ChangePassword(): JSX.Element {
	const {currentUser, setCurrentUser} = useContext(TranscendenceContext);
  const {data: updatePwd, isLoading: loadingPwd, error: errorPwd, fetcher: fetchPwd} = useFetch<UpdatePwdDto, boolean>()
	const hashAttributes: optionalAttributes={type:"password", name:"pwd", required:true, autoComplete:"off", minLength:3, maxLength:30};

  const [pwd, setPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [changePassword, setChangePassword] = useState<string>("");

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

  const changePwd = async () => {
		console.log("Change password");
    setChangePassword("setNewPwd");
	}
  
	return (
		<>
      <button className="btn btn-outline-dark" onClick={changePwd}>Change password</button>
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
