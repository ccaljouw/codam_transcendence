"use client";
import { useContext, useState, useEffect, FormEvent} from 'react';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import StaticDataField from "src/app/profile/[username]/components/utils/StaticDataField";
import FormInput from 'src/globals/functionComponents/form/FormInput';
import useFetch from 'src/globals/functionComponents/useFetch';
import { constants } from 'src/globals/constants.globalvar';
import { UpdateUserDto, UserProfileDto } from '@ft_dto/users';
import { FontBangers } from 'src/globals/layoutComponents/Font';

export default function LoginSettings({user} : {user: UserProfileDto}): JSX.Element {
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
					<StaticDataField name="Login name" data={currentUser.loginName} />
					<StaticDataField name="First name" data={currentUser.firstName} />
					<StaticDataField name="Last name" data={currentUser.lastName} />
					<StaticDataField name="Email" data={currentUser.email} />
					<p>
						Button to Enable two-factor authentication, link to change password
					</p>
					{updatedUser != null && <p>User settings updated!</p>}
					<button className="btn btn-dark" onClick={toggleEditMode}>Edit</button>
					
				</>
			}
			{editMode == true && 
				<>
					<form onSubmit={handleSubmit}>
						<h1>Change your login information</h1>
						<FormInput type="text" name="firstName" text="First Name"/>
						<FormInput type="text" name="lastName" text="Last Name"/>
						<FormInput type="email" name="email" text="Email"/>
						<FormInput type="text" name="loginName" text="Login name"/>
						<FormInput type="password" name="hash" text="Password"/>	
						<FormInput type="password" name="hash2" text="Confirm password"/>
						<button className="btn btn-dark" type="submit" >Save changes</button>
						<button className="btn btn-dark" onClick={toggleEditMode}>Cancel</button>
					</form>
					{isLoading && <p>Loading...</p>}
					{error && <p>Error: {error.message}</p>}
				</>
			}
		</>
	);
}
