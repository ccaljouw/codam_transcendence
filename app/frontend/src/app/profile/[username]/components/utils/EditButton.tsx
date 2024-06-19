export default function EditButton({onClick} : {onClick:() => void}) : JSX.Element {
	return (
		<button className="btn btn-outline-dark btn-sm" onClick={onClick}>✎ Edit</button>
	);
}
