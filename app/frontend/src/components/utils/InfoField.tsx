export default function InfoField({name, data}: {name:string, data:string}) {
	return (
		<>
			{name}   <b>{data}</b><br/>
		</>
	);
}
