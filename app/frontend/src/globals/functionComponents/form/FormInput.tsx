export default function FormInput({type, name, required=false, text}:{type:string, name:string, required?:boolean, text:string}) {

	return (
		<>
			<label htmlFor="floatingInput" >{text}</label>
			<input id="floatingInput" className="form-control" type={type} name={name} required={required}></input>
		</>
	);
}
