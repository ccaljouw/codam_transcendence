"use client";
import { useContext, useState, useEffect } from 'react';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import DataField from "@ft_global/functionComponents/DataField";
import FormInput from 'src/globals/functionComponents/FormInput';
import useFetch from 'src/globals/functionComponents/useFetch';
import { constants } from 'src/globals/constants.globalvar';
import { FormEvent } from 'react';
import { UpdateUserDto, UserProfileDto } from '@ft_dto/users';
import { FontBangers } from 'src/globals/layoutComponents/Font';

export default function LoginSettings(): JSX.Element {
	const {currentUser, setCurrentUser} = useContext(TranscendenceContext);
	const [editMode, setEditMode] = useState<boolean>(false);
	const {data: updatedUser, isLoading, error, fetcher} = useFetch<UpdateUserDto, UserProfileDto>();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault(); //check if needed
		const formData = new FormData(event.currentTarget); // todo: we use new, should we use delete?
		const patchUser: Partial<UpdateUserDto> = {};

		if (formData.get('firstName')) {
			patchUser.firstName = formData.get('firstName')?.toString();
		}

		if (formData.get('lastName')) {
			patchUser.lastName = formData.get('lastName')?.toString();
		}

		if (formData.get('email')) {
			patchUser.email = formData.get('email')?.toString();
		}

		if (formData.get('loginName')) {
			patchUser.loginName = formData.get('loginName')?.toString();
		}

		if (formData.get('hash')) {
			patchUser.hash = formData.get('hash')?.toString();
		}
		
		console.log("New user: " + JSON.stringify(patchUser));
		await fetcher({url: constants.API_USERS + currentUser.id, fetchMethod:'PATCH', payload: patchUser});
	}

	useEffect(() => {
		if (updatedUser != null)
		{
			setCurrentUser(updatedUser);
			toggleEditMode();
		}
	}, [updatedUser]);

	function toggleEditMode() {
		setEditMode(!editMode);
	};

	return (
		<>
			<FontBangers>
				<h3>User information</h3>
			</FontBangers>
			{editMode == false && 
				<>
					<p>From context:</p>
					<DataField name="Login name" data={currentUser.loginName} />
					<DataField name="First name" data={currentUser.firstName} />
					<DataField name="Last name" data={currentUser.lastName} />
					<DataField name="Email" data={currentUser.email} />
					<p>
						Button to Enable two-factor authentication, link to change password
					</p>
					{updatedUser != null && <p>User settings updated!</p>}

					<button onClick={toggleEditMode}>Edit</button>
				</>
			}
			{editMode == true && 
				<>
					<form onSubmit={handleSubmit}>
						<h1>Change your login information</h1>
						<FormInput types="text" text="First Name" theName="firstName" required={false}/>
						<FormInput types="text" text="Last Name" theName="lastName" required={false}/>
						<FormInput types="email" text="Email" theName="email" required={false}/>
						<FormInput types="text" text="Login name" theName="loginName" required={false}/>
						<FormInput types="password" text="Password" theName="hash" required={false}/>	
						<button className="btn btn-dark w-10 py-2 mt-3" type="submit" >Save changes</button>
					</form>
					{isLoading && <p>Loading...</p>}
					{error && <p>Error: {error.message}</p>}
					<button onClick={toggleEditMode}>Cancel</button>
				</>
			}
		</>
	);
}
