export default function SignUp() {
	return (
		<>
		<div className="component">
			<h1>Sign up to play</h1>
			<form className="form" action={"http://10.11.3.1:3000/users/signup"} method="POST">
				<label>Email:
					<input type="text" name="email" /><br />
				</label>
				<label>Password:
					<input type="text" name="hash" /><br />
					<input type="submit" value="Submit" />
				</label>
			</form>
		</div>
		</>
	);
}
