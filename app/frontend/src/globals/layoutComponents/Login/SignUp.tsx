// "use client";
// import { FormEvent, useEffect, useContext } from 'react';
// import { CreateUserDto, UserProfileDto } from '@ft_dto/users';
// import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
// import { constants } from '@ft_global/constants.globalvar'
// import useFetch from '@ft_global/functionComponents/useFetch';
// import FormInput from '@ft_global/functionComponents/form/FormInput';
// import { H3 } from 'src/globals/layoutComponents/Font';

// export default function SignUp(): JSX.Element {
// 	const { data: user, isLoading, error, fetcher } = useFetch<CreateUserDto, UserProfileDto>();
//     const { setCurrentUser } = useContext(TranscendenceContext);

// 	useEffect(() => {
// 		console.log("user changed");
// 		if (user != null)
// 		{
// 			sessionStorage.setItem('userId', JSON.stringify(user.id));
//       sessionStorage.setItem('jwt', user.hash);
// 			setCurrentUser(user);
// 			console.log("setting userId in sessionStorage from signup");
// 		}
// 	}, [user])

// 	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
// 		event.preventDefault(); //check if needed
// 		const formData = new FormData(event.currentTarget); // todo: we use new, should we use delete?
// 		const newUser: CreateUserDto = {
// 			firstName: (formData.get('firstName'))!.toString(),
// 			lastName: (formData.get('lastName'))!.toString(),
// 			userName: (formData.get('userName'))!.toString(),
// 			email: (formData.get('email'))!.toString(),
// 			loginName: (formData.get('loginName'))!.toString(),
// 			hash: (formData.get('hash'))!.toString(),	
// 		};
// 		console.log("New user: " + JSON.stringify(newUser));
// 		await fetcher({
// 			url: constants.API_REGISTER,
// 			fetchMethod: 'POST', 
// 			payload: newUser,
// 		});
// 	}

// 	return (
// 		<>
// 			<div className="white-box">
// 				{isLoading && <p>Sending info to database...</p>}
// 				{error && <p>Error: {error.message}</p>}
// 				{user != null && <p>User created with id {user.id}</p>}
// 				{user == null &&
// 					<form onSubmit={handleSubmit}>
// 					<H3 text='Sign up'/>
// 					<p>It's quick and easy.</p>
// 					<FormInput type="text" name="firstName" required={true} text="First Name"/>
// 					<FormInput type="text" name="lastName" required={true} text="Last Name"/>
// 					<FormInput type="text" name="userName" required={true} text="Username"/>
// 					<FormInput type="email" name="email" required={true} text="Email address"/>
// 					<FormInput type="text" name="loginName" required={true} text="Login name"/>
// 					<FormInput type="password" name="hash" required={true} text="Password"/>
// 					<button className="btn btn-dark w-10 py-2 mt-3" type="submit">Sign Up</button>
// 					</form>
// 				}
// 			</div>
// 		</>
// 	);
// }

//todo: JMA: add validation on form fields

"use client";
import { FormEvent, useContext, useEffect } from 'react';
import { RegisterUserDto, UpdateUserDto, UserProfileDto } from '@ft_dto/users';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { constants } from '@ft_global/constants.globalvar'
import { H3 } from 'src/globals/layoutComponents/Font';
import useFetch from 'src/globals/functionComponents/useFetch';
import FormToCreateUserDto from 'src/globals/functionComponents/form/FormToCreateUserDto';


export default function Register() : JSX.Element {
	const {setCurrentUser} = useContext(TranscendenceContext);
  const {data: loggedUser, isLoading, error, fetcher} = useFetch<RegisterUserDto, { user: UserProfileDto; jwt: string }>();

  useEffect(() => {
    if (loggedUser != null)
      setLoggedUser(loggedUser.user, loggedUser.jwt);
  }, [loggedUser]);

	const setLoggedUser = (user: UserProfileDto, jwt: string) => {
		console.log("Setting new user with id " + user.id + " in ChooseUser");
		setCurrentUser(user);
		sessionStorage.setItem('userId', JSON.stringify(user.id));
    sessionStorage.setItem('jwt', jwt);
	}

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newUser: RegisterUserDto = FormToCreateUserDto(event);
    console.log('Registering new user with data:');
    console.log(newUser);
    
    try {
      await fetcher({
        url: constants.API_REGISTER,
        fetchMethod: 'POST',
        payload: newUser
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

	return (
		<>
			<div className="white-box">
				<H3 text="Register to play some pong"></H3>
          <form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
            <input id="firstName" type="firstName" required={true} className="form-control form-control-sm" placeholder={"firstName"}></input>
            <input id="lastName" type="lastName" required={true} className="form-control form-control-sm" placeholder={"lastName"}></input>
            <input id="userName" type="userName" required={true} className="form-control form-control-sm" placeholder={"userName"}></input>
            <input id="loginName" type="loginName" required={true} className="form-control form-control-sm" placeholder={"loginName"}></input>
            <input id="email" type="email" required={true} className="form-control form-control-sm" placeholder={"email"}></input>
            <input id="password" type="pwd" required={true} className="form-control form-control-sm" placeholder={"password"}></input>
            <button className="btn btn-dark btn-sm" type="submit">Login</button>
          </form>
			</div>
		</>
	);
}