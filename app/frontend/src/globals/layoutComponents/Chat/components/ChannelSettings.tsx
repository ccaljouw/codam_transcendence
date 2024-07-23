import { FetchChatDto, UpdateChatDto } from "@ft_dto/chat";
import { FormEvent, useContext, useEffect, useState } from "react";
import EditableDataField, { optionalAttributes } from "src/app/profile/[username]/components/utils/EditableDataField";
import { constants } from "src/globals/constants.globalvar";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar";
import FormToUpdateChatDto from "src/globals/functionComponents/form/FormToUpdateChatDto";
import useFetch from "src/globals/functionComponents/useFetch";
import { transcendenceSocket } from "src/globals/socket.globalvar";

export default function ChannelSettings({room} : {room: FetchChatDto}) {
	const nameAttributes: optionalAttributes={type:"text", name:"name", required:false, autoComplete:"off", minLength:6, maxLength:30}; //todo: JMA: finetune min and max
	const { data: chatPatched, error: patchError, isLoading: patchIsLoading, fetcher: chatPatcher } = useFetch<UpdateChatDto, FetchChatDto>();
	const { data: chatDeleted, error: deleteError, isLoading: deleteIsLoading, fetcher: chatDeleter } = useFetch<Partial<FetchChatDto>, boolean>();
	// const { data: chatPatched, error: patchError, isLoading: patchIsLoading, fetcher: chatPatcher } = useFetch<Partial<UpdateChatDto>, boolean>();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		console.log("Changing channel name");
		event.preventDefault();
		await chatPatcher({url: constants.API_CHAT + room.id, fetchMethod: 'PATCH', payload: FormToUpdateChatDto(event)})
	}

	useEffect(() => {
		if (chatPatched) {
			console.log("Chat patched");
			transcendenceSocket.emit('chat/patch', chatPatched);
			// todo: make it so that the change take effect immediately, perhaps by sending a websocket message
		}
	}, [chatPatched]);

	const handleDeleteClick = async () => {
		console.log("submitting form field entry");
		await chatDeleter({url: constants.API_CHAT + room.id, fetchMethod: 'DELETE'});
	}

	return (
		<>
			<b>Channel settings here.</b><br />
			<form onChange={handleSubmit} acceptCharset='utf-8' className="row">
				<div className="col col-3">
					<p>Channel visibility</p>
				</div>
				<div className="col col-6">
					<select className="btn-outline-dark form-select custom-select form-select-sm" defaultValue={room.visibility} name="visibility">
						<option key="Public" value="Public" id="visibility">Public</option>
						<option key="Private" value="Private" id="visibility">Private</option>
						<option key="Password" value="Password" id="visibility">Password</option>
					</select>
				</div>
			</form>
			<br />&emsp;&emsp; [with set/change password option]<br />
			<form onSubmit={handleSubmit} acceptCharset='utf-8' className="row">
				<EditableDataField name="Channel name" data={room.name!.toString()} attributes={nameAttributes}/>
			</form>
			{/* todo: albert: trigger reload when chat patch worked */}
			{/* {chatPatched && setCurrentChatRoom} */}
			{patchIsLoading && "Updating chat name..."}
			<button className="btn btn-outline-dark btn-sm"onClick={handleDeleteClick} >Delete channel</button>
			{chatDeleted == true && "Albert: trigger page reload"}
		</>
	)
}

