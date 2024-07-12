import { FormEvent } from 'react';
import { RegisterUserDto } from '@ft_dto/users';

export default function FormToCreateUserDto (event: FormEvent<HTMLFormElement>): RegisterUserDto {
  console.log("in form to createUser");
  const target = event.target as typeof event.target & {
    firstName: { value: string };
    lastName: { value: string };
    userName: { value: string };
    loginName: { value: string };
    email: { value: string };
    password: { value: string };
  };

  const newUser: RegisterUserDto = {
  createUser: {
    firstName: target.firstName.value,
    lastName: target.lastName.value,
    userName: target.userName.value,
    loginName: target.loginName.value,
    email: target.email.value,
  }, 
  pwd: target.password.value,
};

  console.log("new user: ");
  console.log(newUser);
  return newUser;
}
