import { FormEvent } from 'react';
import { CreateUserDto } from '@ft_dto/users';

export default function FormToCreateUserDto (event: FormEvent<HTMLFormElement>) : Partial<CreateUserDto> {
  const target = event.target as typeof event.target & {
    firstName: { value: string };
    lastName: { value: string };
    userName: { value: string };
    loginName: { value: string };
    email: { value: string };
    password: { value: string };
  };

  // Extract values from the form fields
  const firstName = target.firstName.value;
  const lastName = target.lastName.value;
  const userName = target.userName.value;
  const loginName = target.loginName.value;
  const email = target.email.value;
  const hash = target.password.value;

  // Construct the DTO object
  const newUser: CreateUserDto = {
    firstName,
    lastName,
    userName,
    loginName,
    email,
    hash,
  };

  console.log("new user: ");
  console.log(newUser);
  return newUser;
}
