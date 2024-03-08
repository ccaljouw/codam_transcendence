export default async function DataFetcherJson<T>(
    {url} : {url:string} //todo: consider making url a URL instead of string
) : Promise<T> {
	try {
		const response: Response = await fetch(url);
		if (!response.ok)
		{
			console.log('Error in DataFetcherJson: response not ok');
			throw new Error(`Error in DataFetcherJson: response not ok`); 
		}
		const result = await response.json() as T;
		return (result);
	} catch (error) {
		console.error('Error in DataFetcherJson:', error);
		throw new Error('Error in DataFetcherJson: ' + error);
	}
}

//todo: remove this function when useFetch is implemented everywhere