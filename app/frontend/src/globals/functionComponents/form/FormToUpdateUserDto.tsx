import { FormEvent } from 'react';
import { UpdateUserDto } from '@ft_dto/users';

export default function FormToUpdateUserDto (event: FormEvent<HTMLFormElement>) : Partial<UpdateUserDto> {
	const formData = new FormData(event.currentTarget);
	const patchUser: Partial<UpdateUserDto> = {};

	if (formData.get('userName')) {
		patchUser.userName = formData.get('userName')?.toString();
		console.log(`got username: ${patchUser.userName} from form`);
	}

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

	if (formData.get('theme')) {
		patchUser.theme = Number(formData.get('theme'));
	}

	if (formData.get('volume')) {
		patchUser.volume = Number(formData.get('volume'));
	}

	return (patchUser);
}
