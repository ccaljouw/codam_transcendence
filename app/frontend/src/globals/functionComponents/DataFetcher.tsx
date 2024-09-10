import { useEffect } from "react";
import useFetch from "./useFetch";

export default function DataFetcher<T,U> (
	{url, showData, method, showLoading, showError}: {url: string,
	showData: (data: U) => JSX.Element,
	method?: string,
	showLoading?: JSX.Element,
	showError?: (error: Error) => JSX.Element}
)
{
	const {data, isLoading, error, fetcher} = useFetch<T,U>();
	const loadingComponent = showLoading || <>Loading...</>;
	const errorComponent = showError || <>Error: {error?.message}</>;
	
	
	useEffect(() => {
		fetchData();
	}, [url]);

	const fetchData = async () => {
		await fetcher({url: url, fetchMethod: method});
	};

	return (
		<>
			{isLoading && loadingComponent}
			{error && errorComponent}
			{data && showData(data)}
		</>
	)
	// fetcher({url: url, fetchMethod: method});
	// return {data, isLoading, error};
}
