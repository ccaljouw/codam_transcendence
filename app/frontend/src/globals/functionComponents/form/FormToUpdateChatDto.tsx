import { FormEvent } from 'react';
import { UpdateChatDto } from '@ft_dto/chat';

export default function FormToUpdateChatDto (event: FormEvent<HTMLFormElement>) : Partial<UpdateChatDto> {
    const formData = new FormData(event.currentTarget); // todo: we use new, should we use delete?
    const patchChat: Partial<UpdateChatDto> = {};

    if (formData.get('name')) {
        patchChat.name = formData.get('name')?.toString();
    }

    //todo: Albert: add visibility to updateChatDto, uncomment this:
    // if (formData.get('visibility')) {
    //     patchChat.visibility = formData.get('visibility')?.toString();
    // }

    return (patchChat);
}
