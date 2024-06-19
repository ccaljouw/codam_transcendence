import { useEffect, useState } from "react";
import EditButton from "./EditButton";

export type optionalAttributes = {
    type: string,
	name: string,
	required?: boolean,
	autoComplete?: string,
	minLength?: number,
	maxLength?: number,
}

export default function EditableDataField({name, data, attributes} : {name:string, data:string, attributes:optionalAttributes}): JSX.Element {
	const [editMode, setEditMode] = useState<boolean>(false);

	useEffect(() => {
		setEditMode(false);
	}, [data]);

	return (
		<>
				<div className="col col-3">
					<p>{name}</p>
				</div>
				<div className="col col-6">
					{editMode == false?
						<b>{data? data : "Loading data..."}</b>
						:
						<input id="floatingInput" className="form-control form-control-sm" placeholder={data} {... attributes}></input>
					}
				</div>
				<div className="col col-3 align-self-end">
					{editMode == false?
						<EditButton onClick={() => setEditMode(true)}/>
						:
						<>
							<button className="btn btn-outline-dark btn-sm" type="submit">Save</button>
							<button className="btn btn-dark btn-sm" onClick={() => setEditMode(false)}>Cancel</button>
						</>
					}
				</div>
		</>
	);
}
