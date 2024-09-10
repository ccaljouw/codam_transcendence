import { FetchChatDto, UpdateChatDto } from "@ft_dto/chat";
import { FormEvent, useContext, useEffect, useState } from "react";
import { constants } from "src/globals/constants.globalvar";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar";
import EditableDataField from "src/app/(general)/profile/[username]/components/utils/EditableDataField";
import FormToUpdateChatDto from "src/globals/functionComponents/form/FormToUpdateChatDto";
import useFetch from "src/globals/functionComponents/useFetch";
import { transcendenceSocket } from "src/globals/socket.globalvar";
import { ChatType } from "@prisma/client";

export default function ChannelSettings({room} : {room: FetchChatDto}) {
	const { data: chatPatched, error: patchError, isLoading: patchIsLoading, fetcher: chatPatcher } = useFetch<UpdateChatDto, FetchChatDto>();
	const { data: chatDeleted, error: deleteError, isLoading: deleteIsLoading, fetcher: chatDeleter } = useFetch<Partial<FetchChatDto>, boolean>();
	// const { data: chatPatched, error: patchError, isLoading: patchIsLoading, fetcher: chatPatcher } = useFetch<Partial<UpdateChatDto>, boolean>();

	const submitChannelNameChange = async (event: FormEvent<HTMLFormElement>) => {
		console.log("Changing channel name");
		event.preventDefault();
		await chatPatcher({url: constants.API_CHAT + room.id, fetchMethod: 'PATCH', payload: FormToUpdateChatDto(event)})
	}

	const submitPassWordChange = async (event: FormEvent<HTMLFormElement>) => {
		console.log("Changing channel password");
		event.preventDefault();
		// await chatPatcher({url: constants.API_CHAT + room.id, fetchMethod: 'PATCH', payload: FormToUpdateChatDto
	}

	useEffect(() => {
		if (chatPatched) {
			console.log("Chat patched");
			chatPatched.action = "patch";
			transcendenceSocket.emit('chat/patch', chatPatched);
		}
	}, [chatPatched]);

	const handleDeleteClick = async () => {
		console.log("submitting form field entry");
		await chatDeleter({url: constants.API_CHAT + room.id, fetchMethod: 'DELETE'});
	}

	return (
		<>
			<b>Channel settings here.</b><br />
			<form onChange={submitChannelNameChange} acceptCharset='utf-8' className="row">
				<div className="col col-3">
					<p>Channel visibility</p>
				</div>
				<div className="col col-6">
					<select className="btn-outline-dark form-select custom-select form-select-sm" defaultValue={room.visibility} name="visibility">
						<option key="Public" value="PUBLIC" id="visibility">Public</option>
						<option key="Private" value="PRIVATE" id="visibility">Private</option>
						<option key="Password" value="PROTECTED" id="visibility">Password</option>
					</select>
					{((chatPatched && chatPatched.visibility == ChatType.PROTECTED) || (!chatPatched && room.visibility == ChatType.PROTECTED)) && // if the room is protected, show the password field
						<form method="post" onSubmit={submitPassWordChange}>
						<input className="form-control form-control-sm" placeholder="new password" type="password" name="password" required={true} autoComplete="new-password" minLength={6} maxLength={30}></input>
						<input type="submit" value="Save Password" />
						</form>
					}
				</div>
			</form>
			<br />&emsp;&emsp; [with set/change password option]<br />
			<form onSubmit={submitChannelNameChange} acceptCharset='utf-8' className="row">
				<EditableDataField name="Channel name" data={room.name}>
					<input className="form-control form-control-sm" placeholder={room.name} type="text" name="name" required={false} autoComplete="off" minLength={6} maxLength={30}></input> {/* //todo: JMA: finetune min and max */}
				</EditableDataField>
			</form>
			{/* todo: albert: trigger reload when chat patch worked */}
			{/* {chatPatched && setCurrentChatRoom} */}
			{patchIsLoading && "Updating chat name..."}
			<button className="btn btn-outline-dark btn-sm"onClick={handleDeleteClick} >Delete channel</button>
			{chatDeleted == true && "Albert: trigger page reload"}
		</>
	)
}
