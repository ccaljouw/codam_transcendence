import { UpdateUserDto, UserProfileDto } from '@ft_dto/users';
import { H3 } from 'src/globals/layoutComponents/Font';
import { FormEvent, useContext, useEffect } from 'react';
import useFetch from 'src/globals/functionComponents/useFetch';
import { TranscendenceContext } from 'src/globals/contextprovider.globalvar';
import { constants } from 'src/globals/constants.globalvar';
import FormToUpdateUserDto from 'src/globals/functionComponents/form/FormToUpdateUserDto';

function ThemeOptions({theme}:{theme: number}) : JSX.Element[] {
	const options = [];
	for (let i = 0; i < constants.themes.length; i++){
		options.push(<option key={i} value={i} id="theme">{constants.themes[i]}</option>);
	}
	return (options);
}

export default function GameSettings({user} : {user: UserProfileDto}) : JSX.Element {
	const {currentUser, setCurrentUser} = useContext(TranscendenceContext);
	const {data: updatedUser, isLoading, error, fetcher} = useFetch<UpdateUserDto, UserProfileDto>();
	useEffect(() => {
		if (updatedUser != null){
			setCurrentUser(updatedUser);
		}
	}, [updatedUser]);
	
	const handleChange = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await fetcher({url: constants.API_USERS + currentUser.id, fetchMethod: 'PATCH', payload: FormToUpdateUserDto(event)})
	}
	
	// todo: show loading state and error when relevant 
	return (
		<>
			<H3 text="Game settings"/>
			<form onChange={handleChange} acceptCharset='utf-8' className="row">
				<div className="col col-3">
					<p>Theme</p>
				</div>
				<div className="col col-6">
					{/* todo: handle submit. Consider to change to dropdown-menu */}
					<select className="form-select custom-select form-select-sm" defaultValue={constants.themes[currentUser.theme]} name="theme">
						<ThemeOptions theme={user.theme}/>
					</select>
				</div>
				{/* <div className="col col-3">
					<button className="btn btn-outline-dark btn-sm" type="submit">Save</button>
				</div> */}
			</form>
			{isLoading !== null && <p>Changing color preferences</p>}
			{error !== null && <p>error: {error.message}</p>}
		</>
	);
}
