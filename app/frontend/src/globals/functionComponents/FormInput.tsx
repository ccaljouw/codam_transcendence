export default function FormInput({types, text, theName, required}:{types:string, text:string, theName:string, required:boolean}) {
	return (
		<>
			<div className="form-floating">
				<input id="floatingInput" className="form-control" type={types} name={theName} required={required}></input>
				<label htmlFor="floatingInput" >{text}</label>
			</div>
		</>
	);
}
