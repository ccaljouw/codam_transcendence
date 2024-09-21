import { useEffect, useState } from "react";
import EditButton from "./EditButton";

export default function ({name, data, close, editText, saveText, children} : {name: string, data: string, close?: boolean, editText?: string, saveText? : string, children?: React.ReactNode}) : JSX.Element {
	const [editMode, setEditMode] = useState<boolean>(false);

	useEffect(() => {
		setEditMode(false);
	}, [data]);

	useEffect(() => {
		if (close == true)
			setEditMode(false);
	}, [close]);

	return (
		<>
			<div className="col col-3">
				<p>{name}</p>
			</div>
			<div className="col col-6 px-2">
				{editMode == false?
					<b>{data? data : "Loading data..."}</b>
					:
					<>
						{children}
					</>
				}
			</div>
			<div className="col col-3 px-2 align-content-end">
				{editMode == false?
					<EditButton editText={editText} onClick={() => setEditMode(true)}/>
					:
					<>
						<button className={`btn enabled btn-outline-dark btn-sm`} type="submit">{saveText? saveText : "Save"}</button>
						<button className="btn btn-dark btn-sm" onClick={() => setEditMode(false)}>Cancel</button>
					</>
				}
			</div>
		</>
	);
}
