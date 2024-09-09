import { FormEvent } from 'react';
import { UpdateUserDto } from '@ft_dto/users';

export default function FormToUpdateUserDto (event: FormEvent<HTMLFormElement>) : Partial<UpdateUserDto> {
    const formData = new FormData(event.currentTarget); // todo: we use new, should we use delete?
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
        // console.log(`theme value is: ${Number(themeValue)}`);
    }

    if (formData.get('volume')) {
        patchUser.volume = Number(formData.get('volume'));
        // console.log(`volume value is: ${Number(volumeValue)}`);
    }

    //todo: consider adding avatarId and online status
    return (patchUser);
}
