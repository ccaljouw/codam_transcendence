export default async function DataFetcherJson(
	{url} : {url:string}
) {
	try {
		const response: Response = await fetch(url);
		if (!response.ok) // todo: check if needed here
		{
			console.log('Error in DataFetcherJson: response not ok')
			const error : Error = new Error(`Error in DataFetcherJson: response not ok`);
			return (error);
		}
		const result = await response.json();
		return (result);
	} catch (error) {
		console.error('Error in DataFetcherJson:', error);
		return (error);
	}
}

