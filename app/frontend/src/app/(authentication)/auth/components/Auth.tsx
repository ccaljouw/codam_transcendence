"use client";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { H3 } from 'src/globals/layoutComponents/Font';
import useAuthentication from 'src/globals/functionComponents/useAuthentication';
import { constants } from 'src/globals/constants.globalvar';

export default function Page() : JSX.Element {
	const params = useSearchParams();
	const auth42Status = params.get('status');
	const auth42Message = params.get('message');
	const userFromUrl = params.get('user');
	const {fetchUserById} = useAuthentication();

	useEffect(() => {
		if (userFromUrl != null)
		{
			fetchUserById(constants.API_CHECK_ID + userFromUrl);
		}
	}, [userFromUrl, auth42Status]);

	return (
		<>
			<div className="white-box">
				{(auth42Status && auth42Status != "200")?
					<>
						<H3 text="Error"></H3>
						<p>Status: {`${auth42Status}: ${auth42Message}`}</p>
					</>
					:
					<p>Logging in with Auth42 successful</p>
				}
			</div>
		</>
	);
}
