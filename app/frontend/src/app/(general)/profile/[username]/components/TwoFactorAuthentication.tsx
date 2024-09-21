"use client";
import { FormEvent, useContext, useEffect, useState } from 'react';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { CheckTokenDto } from '@ft_dto/authentication'
import { constants } from '@ft_global/constants.globalvar';
import useFetch from 'src/globals/functionComponents/useFetch';
import EditableDataField from './utils/EditableDataField';

export default function TwoFactorAuthentication() : JSX.Element {
	const {currentUser, setCurrentUser} = useContext(TranscendenceContext);
	const {data: twoFA, isLoading: loading2FA, error: error2FA, fetcher: fetch2FA} = useFetch<null, { res: string } >();
	const {data: FAValid, isLoading: loadingFAValid, error: errorFAValid, fetcher: fetchFAValid} = useFetch<CheckTokenDto , boolean >();
	const {data: disable2FA, isLoading: loadingDisable2FA, error: errorDisable2FA, fetcher: fetchDisable2FA} = useFetch<null, boolean>();
	const [token, setToken] = useState<string>('');
	const [twoFactor, setTwoFactorEnabled] = useState(currentUser.twoFactEnabled? "Disable2FA" : "Enable2FA");
	const [qrUrl, setQrUrl] = useState<string | null>(null);
	const [error, setError] = useState<Error | null>(null);
	
	useEffect(() => {
		if (FAValid != null && FAValid == true)
		{
			const user = { ...currentUser, twoFactEnabled: true };
			setTwoFactorEnabled("Disable2FA");
			setCurrentUser(user);
			console.log("2FA Enabled");
		}
		else {
			console.log("TwoFA false");
		}
	}, [FAValid]);

	useEffect(() => {
		if (disable2FA != null && disable2FA == true)
		{
			const user = { ...currentUser, twoFactEnabled: false};
			setTwoFactorEnabled("Enable2FA");
			setCurrentUser(user);
			setToken('');
			setQrUrl(null);
			console.log("2FA Disabled");
		}
	}, [disable2FA]);

	useEffect(() => {
		if (twoFA != null && twoFA.res != '2FA already enabled')
		{
			setQrUrl(twoFA.res);
		}
	}, [twoFA]);

	useEffect(() => {
		if (loading2FA == true || loadingDisable2FA == true || loadingFAValid == true)
		{
			setError(null);
		}
	}, [loading2FA, loadingDisable2FA, loadingFAValid]);

	useEffect(() => {
		if (error2FA != null)
		{
			setError(error2FA);
		} else if (errorDisable2FA != null)
		{
			setError(errorDisable2FA);
		} else if (errorFAValid != null)
		{
			setError(errorFAValid);
		}
	}, [error2FA, errorDisable2FA, errorFAValid]);

	const toggle2FA =  async () => {
		try {
			if (!currentUser.twoFactEnabled) {
				console.log('fetching 2FA url');
				await fetch2FA({url: constants.API_ENABLE2FA + currentUser.id, fetchMethod: 'PATCH'});
			}
			else {
				console.log("disabling 2FA");
				await fetchDisable2FA({ url: constants.API_DISABLE2FA + currentUser.id, fetchMethod: 'PATCH'});
			}
		} catch (error) {
			console.error('Toggling failed:', error);
		}
	}

	const checkToken = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log("submitting created token");
		if (token) {
			console.log(`got token from form: ${token}`)
			try {
				await fetchFAValid({
					url: constants.API_CHECK2FATOKEN,
					fetchMethod: 'POST',
					payload: {  userId: currentUser.id, token}
				});
			} catch (error) {
				console.error('Invalid token failed:', error);
				throw error;
			}
		}
	}

	return (
		<>
			<form onSubmit={checkToken} acceptCharset='utf-8' className="row">
				<EditableDataField name="2FA" data={currentUser.twoFactEnabled == true? "Enabled" : "Disabled"}>
					{((currentUser.twoFactEnabled == false && qrUrl == null) || currentUser.twoFactEnabled == true) && 
						<button className="btn btn-sm btn-outline-dark" type="button" onClick={toggle2FA}>{twoFactor}</button>
					}
					{currentUser.twoFactEnabled == false && qrUrl != null && <>
						<p>Please scan the QR code below with your authentication app and check the resulting token:</p>
						<img className="img-fluid" src={qrUrl}/>
						<input type="text" name="Token" value={token} onChange={(e) => setToken(e.target.value)} className="form-control form-control-sm" placeholder="Enter Token" minLength={6} maxLength={6}/>
					</>}
				</EditableDataField>
			</form>
			{FAValid == false && <p>Not possible to enable 2FA. Refresh page and try again</p>}
			{disable2FA == false && <p>Not possible to disable 2FA. Refresh page and try again</p>}
			{loading2FA == true && <p>Generating QR code... </p>}
			{loadingFAValid == true && <p>Checking token... </p>}
			{loadingDisable2FA == true && <p>Disabeling 2FA authentication... </p>}
			{qrUrl == '2FA already enabled' && 
				<p>Two factor authentication already enabled</p>
			}
			{error != null && <p>{error.name}: {error.message}</p>}
		</>
	);
}
