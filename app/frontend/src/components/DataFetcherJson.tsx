export default async function DataFetcherJson<T>(
    {url} : {url:string}
) : Promise<T> {
	try {
		const response: Response = await fetch(url);
		if (!response.ok) // todo: check if needed here
		{
			console.log('Error in DataFetcherJson: response not ok')
			throw new Error(`Error in DataFetcherJson: response not ok`);
		}
		const result = await response.json() as T;
		return (result);
	} catch (error) {
		console.error('Error in DataFetcherJson:', error);
		throw new Error('Error in DataFetcherJson' + error);
	}
}
