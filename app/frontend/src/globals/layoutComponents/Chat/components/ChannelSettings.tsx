import { UpdateChatDto } from "@ft_dto/chat";
import { FormEvent, useContext } from "react";
import EditableDataField, { optionalAttributes } from "src/app/profile/[username]/components/utils/EditableDataField";
import { constants } from "src/globals/constants.globalvar";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar";
import FormToUpdateChatDto from "src/globals/functionComponents/form/FormToUpdateChatDto";
import useFetch from "src/globals/functionComponents/useFetch";

export default function ChannelSettings({room} : {room: UpdateChatDto}) {
	const { currentUser} = useContext(TranscendenceContext);
	const nameAttributes: optionalAttributes={type:"text", name:"name", required:false, autoComplete:"off", minLength:6, maxLength:30}; //todo: JMA: finetune min and max
	const { data: chatPatched, error: patchError, isLoading: patchIsLoading, fetcher: chatPatcher } = useFetch<Partial<UpdateChatDto>, boolean>();
	const { data: chatDeleted, error: deleteError, isLoading: deleteIsLoading, fetcher: chatDeleter } = useFetch<Partial<UpdateChatDto>, boolean>();
	// const { data: chatPatched, error: patchError, isLoading: patchIsLoading, fetcher: chatPatcher } = useFetch<Partial<UpdateChatDto>, boolean>();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		console.log("Changing channel name");
		event.preventDefault();
		await chatPatcher({url: constants.API_CHAT + room.id, fetchMethod: 'PATCH', payload: FormToUpdateChatDto(event)})
	}

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
			{chatPatched == true && "Albert: trigger page reload"}
			{patchIsLoading && "Updating chat name..."}
			<button className="btn btn-outline-dark btn-sm"onClick={handleDeleteClick} >Delete channel</button>
			{chatDeleted == true && "Albert: trigger page reload"}
		</>
	)
}

