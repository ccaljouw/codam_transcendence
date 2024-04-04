export default function FormInput({type, name, required, text}:{type:string, name:string, required:boolean, text:string}) {
	return (
		<>
			<div className="form-floating">
				<input id="floatingInput" className="form-control" type={type} name={name} required={required}></input>
				<label htmlFor="floatingInput" >{text}</label>
			</div>
			{/* <div >
				<label htmlFor="floatingInput" >{text}</label>
				<input id="floatingInput" className="form-control" type={type} name={name} required={required}></input>
			</div> */}
		</>
	);
}
