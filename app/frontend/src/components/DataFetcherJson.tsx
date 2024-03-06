export default async function DataFetcherJson<T>(
    {url} : {url:string}
) : Promise<T> {
	try {
		const response: Response = await fetch(url);
		if (!response.ok)
		{
			console.log('Error in DataFetcherJson: Response not ok');
			throw new Error('Error in DataFetcherJson: Response not ok' + response.status + ': ' + response.statusText); //todo: eigen error
		}
		const result = await response.json() as T;
		return (result);
	} catch (error) {
		console.error('Error in DataFetcherJson:', error);
		throw new Error('Error in DataFetcherJson: ' + error);
	}
}
