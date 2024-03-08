export default async function DataFetcherJson<T>(
    {url, method, payload} : {url:string, method?:string, payload?:string} //todo: consider makng url a URL instead of string
) : Promise<T> {
	try {
		const requestOptions : RequestInit = {
			method: `${method}`,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({payload}),
		};
		const response: Response = await fetch(url, requestOptions);
		if (!response.ok)
		{
			console.log('Error in DataFetcherJson: response not ok');
			throw new Error(`Error in DataFetcherJson: response not ok`); 
		}
		const result = await response.json() as T;
		return (result); //todo: return data, isLoading, error
	} catch (error) {
		console.error('Error in DataFetcherJson:', error);
		throw new Error('Error in DataFetcherJson: ' + error); //todo: return data=null, isLoading, error
	}
}
