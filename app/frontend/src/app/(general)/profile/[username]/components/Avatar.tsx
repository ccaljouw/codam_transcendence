import { useContext, useEffect, useState } from "react";
import { constants } from '@ft_global/constants.globalvar';
import EditButton from "src/app/(general)/profile/[username]/components/utils/EditButton";
import useFetch from "src/globals/functionComponents/useFetch";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar";
import { UpdateUserDto, UserProfileDto } from "@ft_dto/users";

export default function Avatar({user, editable} : {user: UserProfileDto, editable: boolean}) : JSX.Element {
	const {currentUser, setCurrentUser} = useContext(TranscendenceContext);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);
	const [avatarUrl, setAvatarUrl] = useState<string>(user.avatarUrl);
	const maxFileSize = 8000000;
	const [tooBigFile, setTooBigFile] = useState<boolean>(false);
	const {data: newAvatarUrl, error: errorStoringNewAvatarUrl, fetcher: storeNewAvatarUrl} = useFetch<Partial<UpdateUserDto>, boolean>();
	const {data: postedAvatarUrl, error: errorPostingAvatar, fetcher: postAvatar} = useFetch<FormData, {avatarUrl: string}>();

	useEffect(() => {
		if (avatarUrl != null && newAvatarUrl == true)
		{
			const user = { ...currentUser, avatarUrl };
			setCurrentUser(user);
			console.log(`reload page from userInfo, new avatarUrl: ${avatarUrl}, current user: ${currentUser.avatarUrl}`);
		}
	}, [avatarUrl, newAvatarUrl]);
	
	useEffect(() => {
	if (postedAvatarUrl != null)
	{
		console.log(`postedAvatarUrl: ${postedAvatarUrl.avatarUrl}`);
		setTooBigFile(false);
		setAvatarUrl(postedAvatarUrl.avatarUrl);
		storeNewAvatarUrl({ url: constants.API_USERS + currentUser.id, fetchMethod: 'PATCH', payload: { avatarUrl: postedAvatarUrl.avatarUrl }});
	}
	}, [postedAvatarUrl]);

	const selectNewImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		try {
		if(file && file.size < maxFileSize) {
			const formData = new FormData();
			console.log(`Form data: `);
			formData.append('file', file);
			console.log(formData);
			postAvatar({url: constants.API_NEW_AVATAR, fetchMethod: 'POST', payload: formData});
		} else if(file) {
			console.log('file too big');
			setTooBigFile(true);
		} else {
			console.log("no file selected");
		}
		} catch (e: any) { 
			console.log("error uploading avatar: ", e.message);
			setError(e);
		} finally {
			setIsLoading(false);
		}
	};
	
	return (
		<>
			<div className="row">
				<div className="col col-3">
					<p>Avatar</p>
				</div>
				<div className={`col ${editable? "col-6" : "col-9"} px-2`}>
					<img className="img-fluid" src={avatarUrl} alt={`${constants.API_AVATAR}favicon.ico`}/>
				</div>
				<div className="col col-3 px-2 align-content-end">
					{editable && <>
						<EditButton onClick={() => document.getElementById('fileInput')?.click()}/>
						<input
							type="file"
							accept="image/*"
							id="fileInput"
							style={{ display: 'none' }} 
							onChange={selectNewImage} 
							/>
						</>
					}
				</div>
			</div>
			{editable && tooBigFile == true && <p>Error: File too big. Should be smaller than {maxFileSize}B</p>}
			{editable && isLoading == true && <p>Updating avatar...</p>}
			{editable && error != null && <p>Not possible to update avatar: {error.message}</p>}
			{editable && errorPostingAvatar != null && <p>Not possible to update avatar: {errorPostingAvatar.message}</p>}
			{editable && errorStoringNewAvatarUrl != null && <p>Error storing new avatarUrl in database: {errorStoringNewAvatarUrl.message}</p>}
		</>
	);
}
