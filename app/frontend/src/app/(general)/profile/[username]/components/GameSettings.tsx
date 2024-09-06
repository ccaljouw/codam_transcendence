import { UpdateUserDto, UserProfileDto } from '@ft_dto/users';
import { H3 } from 'src/globals/layoutComponents/Font';
import { FormEvent, useContext, useEffect, useState } from 'react';
import useFetch from 'src/globals/functionComponents/useFetch';
import { TranscendenceContext } from 'src/globals/contextprovider.globalvar';
import { constants } from 'src/globals/constants.globalvar';
import FormToUpdateUserDto from 'src/globals/functionComponents/form/FormToUpdateUserDto';

function ThemeOptions() : JSX.Element[] {
	const options = [];
	for (let i = 0; i < constants.themes.length; i++){
		options.push(<option key={i} value={i} id="theme">{constants.themes[i]}</option>);
	}
	return (options);
}

export default function GameSettings() : JSX.Element {
	const {currentUser, setCurrentUser} = useContext(TranscendenceContext);
	const {data: updatedUser, isLoading, error, fetcher} = useFetch<UpdateUserDto, UserProfileDto>();
	const [volume, setVolume] = useState<number>(currentUser.volume);
	const [isDragging, setIsDragging] = useState<boolean>(false);

	useEffect(() => {
		if (updatedUser != null && isDragging == false){
			setCurrentUser(updatedUser);

			if (!isDragging)
			{
				setVolume(updatedUser.volume);
			}
			console.log(`Volume in userSettings updated to ${updatedUser.volume} while volume is ${volume} in updatedUser useEffect`);
		}
	}, [updatedUser, isDragging, currentUser]);

	useEffect(() => {
		if (isDragging == false && currentUser!= null && volume != currentUser.volume)
		{
			console.log(`Volume was set to ${currentUser.volume} in currentUser useEffect`);
			setVolume(currentUser.volume);
		}
	}, [currentUser, volume]);

	useEffect(() => {
		console.log(`Dragging is ${isDragging}`);
	}, [isDragging]);
	
	useEffect(() => {
		console.log(`Volume is ${volume}`);
	}, [volume]);

	const handleChange = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log("fetching updated user in handleChange");
		await fetcher({url: constants.API_USERS + currentUser.id, fetchMethod: 'PATCH', payload: FormToUpdateUserDto(event)})
	}

	const handleVolumeChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		console.log(`Volume was set to ${Number(event.target.value)} in handleVolumeChange`);

        setVolume(Number(event.target.value));
		setIsDragging(true);
	}

	const handleVolumeSave = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsDragging(false);
		await fetcher({url: constants.API_USERS + currentUser.id, fetchMethod: 'PATCH', payload: FormToUpdateUserDto(event)});
	}

	return (
		<>
			<H3 text="Game settings"/>
			<form onChange={handleChange} acceptCharset='utf-8' className="row">
				<div className="col col-3">
					<p>Theme</p>
				</div>
				<div className="col col-6">
					<select className="btn-outline-dark form-select custom-select form-select-sm" defaultValue={currentUser.theme} name="theme">
						<ThemeOptions/>
					</select>
				</div>
			</form>
			<form onSubmit={handleVolumeSave} acceptCharset='utf-8' className="row">
				<div className="col col-3">
					<p>Volume</p>
				</div>
				<div className="col col-6">
					<input type="range" min="0" max="1" value={volume} onChange={handleVolumeChange} className="slider" step="0.01" name="volume" id="volume"/>
				</div>
				<div className="col col-3 px-2">
					{volume != currentUser.volume && 
						<button className={`btn enabled btn-outline-dark btn-sm`} type="submit">Save</button>
					}
				</div>
			</form>
			{isLoading == true && <p>Changing game settings</p>}
			{error != null && <p>error: {error.message}</p>}
		</>
	);
}
