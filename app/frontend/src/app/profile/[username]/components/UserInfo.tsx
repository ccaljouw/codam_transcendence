'use client';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import DataField from '@ft_global/functionComponents/DataField';
import { FontBangers } from 'src/globals/layoutComponents/Font';
import { UpdateUserDto, UserProfileDto } from '@ft_dto/users';
import { constants } from '@ft_global/constants.globalvar';
import useFetch from 'src/globals/functionComponents/useFetch';
import FormToUpdateUserDto from 'src/globals/functionComponents/form/FormToUpdateUserDto';

function EditableUserName() {
	const {currentUser, setCurrentUser} = useContext(TranscendenceContext);
	const [editMode, setEditMode] = useState<boolean>(false);
	const {data: updatedUser, isLoading, error, fetcher} = useFetch<UpdateUserDto, UserProfileDto>();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await fetcher({url: constants.API_USERS + currentUser.id, fetchMethod: 'PATCH', payload: FormToUpdateUserDto(event)})
	}

	useEffect(() => {
		if (updatedUser != null && updatedUser.userName != null	)
		{
			setCurrentUser(updatedUser);
			setEditMode(false);
		}
	}, [updatedUser]);

	return (
		<>
			{editMode == false? <>
				<DataField name="Username" data={currentUser.userName}/>
				<button className="btn btn-dark" onClick={() => setEditMode(true)}>Edit</button>
				</>:
				<form onSubmit={handleSubmit} acceptCharset='utf-8' >
					<label htmlFor="floatingInput">New userName:</label>
					<input id="floatingInput" className="form-control" type="text" name="userName" required minLength={3} maxLength={30} autoComplete="off" placeholder={currentUser.userName}></input>
					{isLoading == true && <p>Updating userName...</p>}
					{error != null && <p>Not possible to update userName: {error.message}</p>}
					<button className="btn btn-dark" type="submit">Save changes</button>
					<button className="btn btn-dark" onClick={() => setEditMode(false)}>Cancel</button>
				</form>
			}
		</>
	);
}

export default function UserInfo({user, editable} : {user: UserProfileDto, editable: boolean}): JSX.Element {
	return (
		<>
			<FontBangers>
				<h3>User information</h3>
			</FontBangers>
			<p>From database:</p>
			<DataField name="Avatar" data={user.avatarId} />
			{editable? <EditableUserName/> : <DataField name="Username" data={user.userName}/>}
			<DataField name="Online" data={user.online} /> 
			<DataField name="Rank" data={"#" + user.rank} /> 
		</>
	);
}

//todo: consider to use these: 🔒 🔓

//todo: id and online status not properly shown yet, fix this
