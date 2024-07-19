import { useContext, useEffect } from "react";
import { constants } from '@ft_global/constants.globalvar';
import EditButton from "src/app/profile/[username]/components/utils/EditButton";
import useFetch from "src/globals/functionComponents/useFetch";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar";

export default function Avatar() : JSX.Element {
  const {currentUser, setCurrentUser} = useContext(TranscendenceContext);
  const {data: avatarUrl, isLoading, error, fetcher: postAvatar} = useFetch<string, string>();
  // const [image, setImage] = useState<string>(currentUser.avatarUrl);

  useEffect(() => {
    if (avatarUrl != null)
		{
      // TODO: Albert: make setAvatar in transcendence context?
      const user = currentUser;
      user.avatarUrl = avatarUrl;
      setCurrentUser(user);
      // setImage(avatarUrl);
      console.log("reload page from userInfo");
		}
	}, [avatarUrl]);

  const postNewAvatar = async (file: string) => {
		console.log("Posting new avatar");
		await postAvatar({url: constants.API_NEW_AVATAR + currentUser.id, fetchMethod: 'POST', payload: file})
	}
   
  const selectNewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if(file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        postNewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
  
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
          <img src={currentUser.avatarUrl} alt="/favicon.ico" width="100" height="100" style={{ borderRadius: '40%' }}/>
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

    </>
  );
};