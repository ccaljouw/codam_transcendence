export default function EditButton({editText, onClick} : {editText?: string, onClick:() => void}) : JSX.Element {
	return (
		<button className="btn btn-outline-dark btn-sm" onClick={onClick}>{editText? editText : "✎ Edit"}</button>
	);
}
