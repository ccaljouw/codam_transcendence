import { useContext, useEffect, useState } from "react";
import { constants } from '@ft_global/constants.globalvar';
import EditButton from "src/app/profile/[username]/components/utils/EditButton";
import useFetch from "src/globals/functionComponents/useFetch";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar";
import { UpdateUserDto } from "@ft_dto/users";

export default function Avatar() : JSX.Element {
  const {currentUser, setCurrentUser} = useContext(TranscendenceContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(currentUser.avatarUrl)
  const {data: newAvatarUrl, isLoading: storingNewAvatarUrl, error: errorSroringNewAvatarUrl, fetcher: storeNewAvatarUrl} = useFetch<UpdateUserDto, boolean >();

  useEffect(() => {
    if (avatarUrl != null)
		{
      const user = { ...currentUser, avatarUrl };
      setCurrentUser(user);
      console.log(`reload page from userInfo, new avatarUrl: ${avatarUrl}, current user: ${currentUser.avatarUrl}`);
		}
	}, [avatarUrl]);
  
  const selectNewImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
      try {
        if(file) {
          setIsLoading(true);

          const jwtToken = sessionStorage.getItem('jwt');
          console.log('Jwt', jwtToken);
          const headers: HeadersInit = jwtToken ? { 'Authorization': `Bearer ${jwtToken}` } : {};
          if (!jwtToken) {
              console.log('No jwt token in session storage');
          }

          const formData = new FormData();
          console.log(`Form data: `);
          formData.append('file', file);
          console.log(formData);
          const response = await fetch(constants.API_NEW_AVATAR, {
            
            method: 'POST',
            body: formData,
            headers: headers,
          });
          if (!response.ok) {
              throw new Error(`Response not ok: ${response.status}: ${response.statusText}`);
          }
          const newUrl = await response.text();
          setAvatarUrl(newUrl);
          storeNewAvatarUrl({ url: constants.API_USERS + currentUser.id, fetchMethod: 'PATCH', payload: { avatarUrl: newUrl }});
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
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <hr />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', alignItems: 'center' }}>
        <div style={{ textAlign: 'left', gridColumn: '1 / 2' }}>
          <p>Avatar</p>
        </div>
        <div style={{ gridColumn: '2 / 3' }}>
          <img src={avatarUrl} alt={`${constants.BACKEND_BASEURL}/avatar/favicon.ico`} width="100" height="100" style={{ borderRadius: '40%' }}/>
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
    </div> 
    {isLoading == true && <p>Updating avatar...</p>}
		{error != null && <p>Not possible to update avatar: {error.message}</p>}
    {errorSroringNewAvatarUrl != null && <p>Error storing new avatarUrl in database...</p>}
    </>
  );
};