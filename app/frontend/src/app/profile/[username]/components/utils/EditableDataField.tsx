import EditButton from "./EditButton";

export default function EditableDataField({name, data, onClick} : {name:string, data: any, onClick:() => void}) {
	return (
		<>
			<div className="row">
				<div className="col col-3">
					<p>{name}</p>
				</div>
				<div className="col col-7">
					<b>{data? data : "Loading data..."}</b>
				</div>
				<div className="col col-2 justify-content-end">
					<EditButton onClick={onClick}/>
				</div>
			</div>
		</>
	);
}
