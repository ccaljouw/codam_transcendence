export default function FormInput({types, text, theName}:{types:string, text:string, theName:string}) {
	return (
		<>
			<div className="form-floating">
				<input id="floatingInput" className="form-control" type={types} name={theName}></input>
				<label htmlFor="floatingInput" >{text}</label>
			</div>
		</>
	);
}
