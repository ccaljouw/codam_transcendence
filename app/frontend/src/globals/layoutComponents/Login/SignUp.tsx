"use client";
import { FormEvent, useEffect, useContext } from 'react';
import { CreateUserDto, UserProfileDto } from '@ft_dto/users';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { constants } from '@ft_global/constants.globalvar'
import useFetch from '@ft_global/functionComponents/useFetch';
import FormInput from '@ft_global/functionComponents/form/FormInput';
import { FontBangers } from 'src/globals/layoutComponents/Font';

export default function SignUp(): JSX.Element {
	const { data: user, isLoading, error, fetcher } = useFetch<CreateUserDto, UserProfileDto>();
    const { setCurrentUser } = useContext(TranscendenceContext);

	useEffect(() => {
		console.log("user changed");
		if (user != null)
		{
			sessionStorage.setItem('userId', JSON.stringify(user.id));
			setCurrentUser(user);
			console.log("setting userId in sessionStorage from signup");
		}
	}, [user])

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault(); //check if needed
		const formData = new FormData(event.currentTarget); // todo: we use new, should we use delete?
		const newUser: CreateUserDto = {
			firstName: (formData.get('firstName'))!.toString(),
			lastName: (formData.get('lastName'))!.toString(),
			userName: (formData.get('userName'))!.toString(),
			email: (formData.get('email'))!.toString(),
			loginName: (formData.get('loginName'))!.toString(),
			hash: (formData.get('hash'))!.toString(),	
		};
		console.log("New user: " + JSON.stringify(newUser));
		await fetcher({
			url: constants.API_REGISTER,
			fetchMethod: 'POST', 
			payload: newUser,
		});
	}

	return (
		<>
			<div className="white-box">
				{isLoading && <p>Sending info to database...</p>}
				{error && <p>Error: {error.message}</p>}
				{user != null && <p>User created with id {user.id}</p>}
				{user == null &&
					<form onSubmit={handleSubmit}>
					<FontBangers>
						<h3>Sign up to play</h3>
					</FontBangers>
					<FormInput type="text" name="firstName" required={true} text="First Name"/>
					<FormInput type="text" name="lastName" required={true} text="Last Name"/>
					<FormInput type="text" name="userName" required={true} text="Username"/>
					<FormInput type="email" name="email" required={true} text="Email address"/>
					<FormInput type="text" name="loginName" required={true} text="Login name"/>
					<FormInput type="password" name="hash" required={true} text="Password"/>
					<button className="btn btn-primary w-10 py-2 mt-3" type="submit">Sign up</button>
					</form>
				}
			</div>
		</>
	);
}

//todo: JMA: add validation on form fields