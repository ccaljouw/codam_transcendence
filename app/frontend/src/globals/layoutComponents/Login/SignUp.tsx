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
  const {data: loggedUser, isLoading, error, fetcher} = useFetch<RegisterUserDto, UserProfileDto>();

  useEffect(() => {
    if (loggedUser != null)
      setLoggedUser(loggedUser);
  }, [loggedUser]);

	const setLoggedUser = (user: UserProfileDto) => {
		console.log("Setting new user with id " + user.id + " in ChooseUser");
		setCurrentUser(user);
		sessionStorage.setItem('userId', JSON.stringify(user.id));
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
      {error && <p>Error: {error.message}</p>}
		</>
	);
}