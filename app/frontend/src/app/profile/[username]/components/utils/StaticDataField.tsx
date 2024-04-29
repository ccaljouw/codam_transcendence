export default function StaticDataField({name, data}: {name:string, data: any}) {
	return (
		<>
			<div className="row">
				<div className="col col-3">
					<p>{name}</p>
				</div>
				<div className="col col-8">
					<b>{data? data : "Loading data..."}</b>
				</div>
			</div>
		</>
	);
}
