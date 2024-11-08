import { FetchChatDto, UpdateChatDto } from "@ft_dto/chat";
import { FormEvent, useContext, useEffect, useState } from "react";
import { constants } from "src/globals/constants.globalvar";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar";
import EditableDataField from "src/app/(general)/profile/[username]/components/utils/EditableDataField";
import FormToUpdateChatDto from "src/globals/functionComponents/form/FormToUpdateChatDto";
import useFetch from "src/globals/functionComponents/useFetch";
import { transcendenceSocket } from "src/globals/socket.globalvar";
import { ChatType } from "@prisma/client";
import { ChatAuthDto } from "@ft_dto/authentication/chat-auth.dto";

export default function ChannelSettings({ room }: { room: FetchChatDto }) {
	const { setCurrentChatRoom, currentChatRoom } = useContext(TranscendenceContext);
	const { data: chatPatched, error: patchError, isLoading: patchIsLoading, fetcher: chatPatcher } = useFetch<UpdateChatDto, FetchChatDto>();
	const { data: chatDeleted, error: deleteError, isLoading: deleteIsLoading, fetcher: chatDeleter } = useFetch<Partial<FetchChatDto>, boolean>();
	const { data: setChatPassword, error: setChatPasswordError, isLoading: setChatPasswordIsLoading, fetcher: chatPasswordSetter } = useFetch<ChatAuthDto, boolean>();
	const [password, setPassword] = useState<string>("");
	const [showSuccess, setShowSuccess] = useState<boolean>(false);
	// const { data: chatPatched, error: patchError, isLoading: patchIsLoading, fetcher: chatPatcher } = useFetch<Partial<UpdateChatDto>, boolean>();

	const submitChannelNameChange = async (event: FormEvent<HTMLFormElement>) => {
		console.log("Changing channel name");
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const newName = form.get('name')?.toString();
		const newVisibility = form.get('visibility');
		if (newName) 
			setCurrentChatRoom({ ...currentChatRoom, name: newName });
		if (newVisibility)
			setCurrentChatRoom({ ...currentChatRoom, visibility: newVisibility as ChatType });
		await chatPatcher({ url: constants.API_CHAT + room.id, fetchMethod: 'PATCH', payload: FormToUpdateChatDto(event) })
	}

	const submitPassWordChange = async (event: FormEvent<HTMLFormElement>) => {
		console.log("Changing channel password");
		event.preventDefault();

		await chatPasswordSetter({ url: constants.API_AUTH_CHANGE_CHAT_PWD, fetchMethod: 'POST', payload: { chatId: room.id, pwd: password } });
		// await chatPatcher({url: constants.API_CHAT + room.id, fetchMethod: 'PATCH', payload: FormToUpdateChatDto
	}

	useEffect(() => {
		if (setChatPassword) {
			console.log("Chat password set");
			setShowSuccess(true);
		}
	}, [setChatPassword]);

	useEffect(() => {
		if (chatPatched) {
			console.log("Chat patched", chatPatched);
			chatPatched.action = "patch";
			transcendenceSocket.emit('chat/patch', chatPatched);
		}
	}, [chatPatched]);

	return (
		<>
			<form onChange={submitChannelNameChange} acceptCharset='utf-8' className="row">
				<div className="col col-3">
					<p>Channel visibility</p>
				</div>
				<div className="col col-6 px-2">
					<select className="btn-outline-dark form-select custom-select form-select-sm" defaultValue={(chatPatched && chatPatched.visibility ? chatPatched.visibility : room.visibility)} name="visibility">
						<option key="Public" value="PUBLIC" id="visibility">Public</option>
						<option key="Private" value="PRIVATE" id="visibility">Private</option>
						<option key="Password" value="PROTECTED" id="visibility">Password</option>
					</select>

				</div>
			</form>
			{((chatPatched && chatPatched.visibility == ChatType.PROTECTED) || (!chatPatched && room.visibility == ChatType.PROTECTED)) && // if the room is protected, show the password field
				<form method="post" onSubmit={submitPassWordChange} className="row">
					<EditableDataField name="Password" data="**********" close={setChatPassword != null? true : false}>
						<input className="form-control form-control-sm" placeholder="new password" type="password" name="password" required={true} autoComplete="new-password" minLength={6} maxLength={30} onChange={(e) => setPassword(e.target.value)}></input>
						{/* {showSuccess ? <>Password saved!</>}//<button onClick={() => setShowSuccess(false)}>"Change again"</button></> : <button className="btn btn-outline-dark btn-sm" type="submit">Save Password</button>} */}
					</EditableDataField>
				</form> 
			}
			<form onSubmit={submitChannelNameChange} acceptCharset='utf-8' className="row">
				<EditableDataField name="Channel name" data={chatPatched? chatPatched.name : room.name} close={chatPatched ? true : false}>
					<input className="form-control form-control-sm" placeholder={room.name} type="text" name="name" required={false} autoComplete="off" minLength={6} maxLength={30}></input>
				</EditableDataField>
			</form>
		</>
	)
}
