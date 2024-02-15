export default function DataField({name, data}: {name:string, data:string}) {
	return (
		<>
			<div className="row">
                <div className="col">
					<p>{name}</p>
				</div>
				<div className="col">
					<b>{data? data : "Loading data..."}</b>
				</div>
			</div>
		</>
	);
}
