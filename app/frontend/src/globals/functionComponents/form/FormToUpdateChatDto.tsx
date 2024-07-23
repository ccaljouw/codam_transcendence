import { FormEvent } from 'react';
import { UpdateChatDto } from '@ft_dto/chat';
import { ChatType } from '@prisma/client';

export default function FormToUpdateChatDto (event: FormEvent<HTMLFormElement>) :UpdateChatDto {
    const formData = new FormData(event.currentTarget); // todo: we use new, should we use delete?
    let patchChat: UpdateChatDto = {};

	const stringToChatType = (str: string): ChatType => {
		switch (str) {
			case "PUBLIC":
				return ChatType.PUBLIC;
			case "PRIVATE":
				return ChatType.PRIVATE;
			case "PROTECTED":
				return ChatType.PROTECTED;
			default:
				return ChatType.PUBLIC;
		}
	}

    if (formData.get('name')) {
        patchChat.name = formData.get('name')?.toString();
    }




    const visibility = formData.get('visibility');
	console.log("visibility: ", visibility);
    if (visibility != null) {
        patchChat.visibility = stringToChatType(visibility.toString());
    }

    return (patchChat);
}
