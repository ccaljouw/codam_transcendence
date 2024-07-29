import { useContext, useEffect, useState } from "react";
import { constants } from '@ft_global/constants.globalvar';
import EditButton from "src/app/profile/[username]/components/utils/EditButton";
import useFetch from "src/globals/functionComponents/useFetch";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar";
import { UpdateUserDto, UserProfileDto } from "@ft_dto/users";
import { use } from "passport";

export default function Avatar({user, editable} : {user: UserProfileDto, editable: boolean}) : JSX.Element {
  const {currentUser, setCurrentUser} = useContext(TranscendenceContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(currentUser.avatarUrl)
  const {data: newAvatarUrl, isLoading: storingNewAvatarUrl, error: errorSroringNewAvatarUrl, fetcher: storeNewAvatarUrl} = useFetch<UpdateUserDto, boolean >();
  const {data: postedAvatarUrl, isLoading: postingAvatar, error: errorPostingAvatar, fetcher: postAvatar} = useFetch<FormData, {avatarUrl: string}>();

  useEffect(() => {
    if (avatarUrl != null)
		{
      const user = { ...currentUser, avatarUrl };
      setCurrentUser(user);
      console.log(`reload page from userInfo, new avatarUrl: ${avatarUrl}, current user: ${currentUser.avatarUrl}`);
		}
	}, [avatarUrl]);
  
  useEffect(() => {
    if (postedAvatarUrl != null)
      {
      console.log(`postedAvatarUrl: ${postedAvatarUrl.avatarUrl}`);
      setAvatarUrl(postedAvatarUrl.avatarUrl);
      storeNewAvatarUrl({ url: constants.API_USERS + currentUser.id, fetchMethod: 'PATCH', payload: { avatarUrl: postedAvatarUrl.avatarUrl }});
    }
  }, [postedAvatarUrl]);

  const selectNewImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
      try {
        if(file) {
          const formData = new FormData();
          console.log(`Form data: `);
          formData.append('file', file);
          console.log(formData);
          postAvatar({url: constants.API_NEW_AVATAR, fetchMethod: 'POST', payload: formData});
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
    // TODO: Jorien: fix styling
    <>
    {editable &&
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <hr />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', alignItems: 'center' }}>
        <div style={{ textAlign: 'left', gridColumn: '1 / 2' }}>
          <p>Avatar</p>
        </div>
        <div style={{ gridColumn: '2 / 3' }}>
          <img src={avatarUrl} alt={`${constants.API_AVATAR}/favicon.ico`} width="100" height="100" style={{ borderRadius: '40%' }}/>
        </div>
        <div style={{ gridColumn: '4 / 6' }}>
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            style={{ display: 'none' }}
            onChange={selectNewImage}
          />
          <EditButton onClick={() => document.getElementById('fileInput')?.click()} />
        </div>
      </div>
      <hr />
    </div> }
    {editable && isLoading == true && <p>Updating avatar...</p>}
    {editable && error != null && <p>Not possible to update avatar: {error.message}</p>}
    {editable && errorSroringNewAvatarUrl != null && <p>Error storing new avatarUrl in database...</p>}
    {editable == false &&         
      <img src={user.avatarUrl} alt={`${constants.API_AVATAR}/favicon.ico`} width="100" height="100" style={{ borderRadius: '40%' }}/>
    }
    </>
  );
};