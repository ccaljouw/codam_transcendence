"use client";
import { FormEvent, useContext, useEffect, useState } from 'react';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { CheckTokenDto } from '@ft_dto/authentication'
import { constants } from '@ft_global/constants.globalvar';
import useFetch from 'src/globals/functionComponents/useFetch';

export default function TwoFactorAuthentication(): JSX.Element {
	const {currentUser, setCurrentUser} = useContext(TranscendenceContext);
  const {data: twoFA, isLoading: loading2FA, error: error2FA, fetcher: fetch2FA} = useFetch<null, { res: string } >();
  const {data: FAValid, isLoading: loadingFAValid, error: errorFAValid, fetcher: fetchFAValid} = useFetch<CheckTokenDto , boolean >();
  const {data: disable2FA, isLoading: loadingDisable2FA, error: errorDisable2FA, fetcher: fetchDisable2FA} = useFetch<null, boolean>();

  const [token, setToken] = useState('');
  const [TwoFactor, setTwoFactorEnabled] = useState(currentUser.twoFactEnabled? "Disable2FA" : "Enable2FA");
	
  useEffect(() => {
    if (FAValid == true )
		{
      const user = { ...currentUser, twoFactEnabled: true };
      setTwoFactorEnabled("Disable2FA");
      setCurrentUser(user);
      console.log("reload page from userInfo");
		}
    else {
      console.log("TwoFA false");
    }
	}, [FAValid]);

  useEffect(() => {
    if (disable2FA == true )
		{
      const user = { ...currentUser, twoFactEnabled: false };
      setTwoFactorEnabled("Enable2FA");
      setCurrentUser(user);
      console.log("reload page from userInfo");
		}
	}, [disable2FA]);

  useEffect(() => {
    if (twoFA?.res == '2FA already enabled' )
		{
      setTwoFactorEnabled("Disable2FA");
		}
	}, [twoFA]);

  const enable2FA =  () => {
    if (!currentUser.twoFactEnabled) {
      console.log('enabeling 2FA');
      fetch2FA({url: constants.API_ENABLE2FA + currentUser.id, fetchMethod: 'PATCH'});
    }
    else {
      console.log("disable 2FA");
      fetchDisable2FA({ url: constants.API_DISABLE2FA + currentUser.id, fetchMethod: 'PATCH'});
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
      } catch (error) {
        console.error('Invalid token failed:', error);
        throw error;
      }
    }
	}


	return (
    //TODO: Jorien fix styling
		<>
      <button className="btn btn-outline-dark" onClick={enable2FA}>{TwoFactor}</button>

      {loading2FA == true && <p>Enabeling 2FA authentication... </p>}
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
      {error2FA != null && <p>Error enabeling 2FA: {error2FA.message}</p>}
      {errorFAValid != null && <p>Error checking token: {errorFAValid.message}</p>}
      {errorDisable2FA != null && <p>Error disabeling 2FA</p>}
		</>
	);
}