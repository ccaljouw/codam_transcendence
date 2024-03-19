import { useEffect } from "react";
import useFetch from "./useFetch";

export default function DataFetcher<T,U> (
	props: {url: string,
	showData: (data: U) => JSX.Element,
	method?: string,
	showLoading?: JSX.Element,
	showError?: (error: Error) => JSX.Element}
)
{
	const {data, isLoading, error, fetcher} = useFetch<T,U>();
	const loadingComponent = props.showLoading || <p>Loading...</p>;
	const errorComponent = props.showError || <p>Error: {error?.message}</p>;
	
	
	useEffect(() => {
		fetchData();
	}, [props.url]);

	const fetchData = async () => {
		await fetcher({url: props.url, fetchMethod: props.method});
	};

	return (
		<>
			{isLoading && loadingComponent}
			{error && errorComponent}
			{data && props.showData(data)}
		</>
	)
	// fetcher({url: url, fetchMethod: method});
	// return {data, isLoading, error};
}
