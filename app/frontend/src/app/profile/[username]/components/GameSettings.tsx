import { UpdateUserDto, UserProfileDto } from '@ft_dto/users';
import { H3 } from 'src/globals/layoutComponents/Font';
import EditButton from './utils/EditButton';
import { FormEvent, useContext, useEffect, useState } from 'react';
import useFetch from 'src/globals/functionComponents/useFetch';
import { TranscendenceContext } from 'src/globals/contextprovider.globalvar';
import { constants } from 'src/globals/constants.globalvar';
import FormToUpdateUserDto from 'src/globals/functionComponents/form/FormToUpdateUserDto';

export default function GameSettings({user} : {user: UserProfileDto}) : JSX.Element {
	const {currentUser, setCurrentUser} = useContext(TranscendenceContext);
	const {data: updatedUser, isLoading, error, fetcher} = useFetch<UpdateUserDto, UserProfileDto>();
	const [editMode, setEditMode] = useState<boolean>(false);

	useEffect(() => {
		setEditMode(false);
	}, [user.email]); //todo: change to user.color_settings / game_settings

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		console.log("submitting form field entry");
		event.preventDefault();
		await fetcher({url: constants.API_USERS + currentUser.id, fetchMethod: 'PATCH', payload: FormToUpdateUserDto(event)})
	}

	return (
		<>
			<H3 text="Game settings"/>
			<form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
				<div className="col col-3">
					<p>Theme&nbsp;</p>
				</div>
				<div className="col col-6">
					{editMode == false?
						<b>{constants.themes[user.theme]}</b>
						:
						<select className="form-select form-select-sm">
						<option value={0}>{constants.themes[0]}</option>
						<option value={1}>{constants.themes[1]}</option>
						<option value={2}>{constants.themes[2]}</option>
						</select>
					}
				</div>
				<div className="col col-3 align-self-end">
					{editMode == false?
						<EditButton onClick={() => setEditMode(true)}/>
						:
						<>
							<button className="btn btn-outline-dark btn-sm" type="submit">Save</button>
							<button className="btn btn-dark btn-sm" onClick={() => setEditMode(false)}>Cancel</button>
						</>
					}
				</div>
			</form>
		</>
	);
}
