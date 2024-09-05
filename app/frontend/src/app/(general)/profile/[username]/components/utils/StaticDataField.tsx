export default function StaticDataField({name, data}: {name:string, data: any}) {
	return (
		<>
			<div className="row">
				<div className="col col-3">
					<p>{name}</p>
				</div>
				<div className="col col-9">
					<b>{data != null? data : "Loading data..."}</b>
				</div>
			</div>
		</>
	);
}
