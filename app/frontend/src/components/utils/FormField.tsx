export default function FormField({label, type, name}: {label:string, type:string, name:string}) {
    return (
        <>
            <label>{label}
                <input type={type} name={name}/>
                <br/>
            </label>
            <br/>
        </>
    );
}
