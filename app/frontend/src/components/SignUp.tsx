export default function SignUp() {
	return (
		<>
			<div className="component">
				<h1>Sign up to play</h1>
				<form className="form" action={"http://localhost:3001/authentication/register"} method="POST">
					<label>Name:
						<input type="text" name="name" /><br />
					</label>
					<br/>
					<label>Surname:
						<input type="text" name="surname" /><br />
					</label>
					<br/>
					<label>Email:
						<input type="text" name="email" /><br />
					</label>
					<br/>
					<label>Password:
						<input type="text" name="hash" /><br />
						<input type="submit" value="Submit" />
					</label>
				</form>
			</div>
		</>
	);
}
