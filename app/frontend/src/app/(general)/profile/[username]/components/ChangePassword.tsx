"use client";
import { FormEvent, useContext, useEffect, useState } from 'react';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { UpdatePwdDto } from '@ft_dto/authentication'
import { constants } from '@ft_global/constants.globalvar';
import useFetch from 'src/globals/functionComponents/useFetch';
import EditableDataField from 'src/app/(general)/profile/[username]/components/utils/EditableDataField';

export default function ChangePassword() : JSX.Element {
	const {currentUser} = useContext(TranscendenceContext);
	const {data: updatePwd, isLoading: loadingPwd, error: errorPwd, fetcher: fetchPwd} = useFetch<UpdatePwdDto, boolean>()

	const [pwd, setPwd] = useState('');
	const [newPwd, setNewPwd] = useState('');
	const [confirmPwd, setConfirmPwd] = useState('');
	const [changePasswordError, setChangePasswordError] = useState<string>("");
	const [stopEditMode, setStopEditMode] = useState<boolean>(false);

	const changePwdSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (changePasswordError == "") {
			const updatePwdDto: UpdatePwdDto = { 
				userId: currentUser.id,
				oldPwd: pwd,
				newPwd: newPwd,
			}
			console.log(`submitting form field entry for pwd change, old pwd: ${pwd}, newpwd: ${newPwd}, id: ${currentUser.id}`);
			await fetchPwd({url: constants.API_CHANGEPWD, fetchMethod: 'PATCH', payload: updatePwdDto});
		}
	}

	useEffect(() => {
		if (pwd.length == 0 || newPwd.length == 0 || confirmPwd.length == 0)
			setChangePasswordError("");
		else if (pwd.length < 10 || pwd.length > 50)
		{
			setChangePasswordError("Old password should be between 10 and 50 characters");
		}
		else if (newPwd.length < 10 || newPwd.length > 50)
		{
			setChangePasswordError("New password should be between 10 and 50 characters");
		}
		else if (pwd == newPwd)
		{
			setChangePasswordError("New password can not be the same as old password");
		}
		else if (confirmPwd != newPwd)
		{
			setChangePasswordError("New password and confirmation of new password should be identical");
		}
		else
			setChangePasswordError("");
	}, [pwd, newPwd, confirmPwd]);
	
	useEffect(() => {
		setStopEditMode(false);
	}, [changePasswordError]);

	useEffect(() => {
		if (updatePwd == true)
			setStopEditMode(true);
	}, [updatePwd]);

	return (
		<>
			<form onSubmit={changePwdSubmit} acceptCharset='utf-8' className="row">
				<EditableDataField name="Password" data="**********" close={stopEditMode}>
					<input type="password" name="Old password" 
						required={true} minLength={10} maxLength={50} onChange={(e) => setPwd(e.target.value)} className="form-control form-control-sm" 
						placeholder="Enter old password"/>
					<input type="password" name="New password" 
						required={true} minLength={10} maxLength={50} onChange={(e) => setNewPwd(e.target.value)} className="form-control form-control-sm" 
						placeholder="Enter new password"/>
					<input type="password" name="Confirm new password" 
						required={true} minLength={10} maxLength={50} onChange={(e) => setConfirmPwd(e.target.value)} className="form-control form-control-sm" 
						placeholder="Confirm new password"/>
					{changePasswordError}
					{loadingPwd && <p>Saving...</p>}
					{errorPwd && <p>Not possible to change password: {errorPwd.message}</p>}
				</EditableDataField>
			</form>
		</>
	);
}
