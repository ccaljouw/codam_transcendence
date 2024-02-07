export default function InfoField({name, data}: {name:string, data:string}) {
	return (
		<>
			<tr>
				<td>{name}</td>
				<td>{data}</td>
			</tr>
		</>
	);
}
