'use client';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import StaticDataField from 'src/app/profile/[username]/components/utils/StaticDataField';
import EditableDataField from 'src/app/profile/[username]/components/utils/EditableDataField';
import { H3 } from 'src/globals/layoutComponents/Font';
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
				
				<EditableDataField name="Username" data={currentUser.userName} onClick={() => setEditMode(true)}/>
				</>:
				<form onSubmit={handleSubmit} acceptCharset='utf-8'>
					<div className="row">
						<div className="col col-3">
							<label htmlFor="floatingInput">Username</label>
						</div>
						<div className="col col-6">
							<input id="floatingInput" className="form-control form-control-sm" type="text" name="userName" required minLength={3} maxLength={30} autoComplete="off" placeholder={currentUser.userName}></input>
						</div>
						<div className="col col-3">
							<button className="btn btn-outline-dark btn-sm" type="submit">Save</button>
							<button className="btn btn-dark btn-sm" onClick={() => setEditMode(false)}>Cancel</button>
						</div>
					</div>
					{isLoading == true && <p>Updating userName...</p>}
					{error != null && <p>Not possible to update userName: {error.message}</p>}
				</form>
			}
		</>
	);
}

export default function UserInfo({user, editable} : {user: UserProfileDto, editable: boolean}): JSX.Element {
	return (
		<>
			<H3 text="User information"/>
			<StaticDataField name="Avatar" data={user.avatarId} />
			{editable? <EditableUserName/> : <StaticDataField name="Username" data={user.userName}/>}
			<StaticDataField name="Online" data={user.online} /> 
			<StaticDataField name="Rank" data={"#" + user.rank} /> 
		</>
	);
}

//todo: consider to use these: 🔒 🔓

//todo: id and online status not properly shown yet, fix this
