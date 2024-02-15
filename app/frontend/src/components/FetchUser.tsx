export default async function FetchUser() {
	try {
		const userId = sessionStorage.getItem('userId'); // todo: change to token
		const response = await fetch('http://localhost:3001/users/' + userId);
		const result = await response.json();
		return (result);
	} catch (error) {
		console.error('Error fetching data:', error);
		return (null);
	}
}
