import React, { useState, useEffect } from 'react';
import DataFetcherJson from './DataFetcherJson';

interface DataFetcherMarkupProps<T> {
  url: string;
  renderLoading?:  React.ReactNode;
  renderError?: (error: any) => React.ReactNode;
  renderData: (data: T) => React.ReactNode;
}

function DataFetcherMarkup<T>({
  url,
  renderLoading,
  renderError = (error) => <p>Error: {error.message}</p>,
  renderData,
}: DataFetcherMarkupProps<T>): JSX.Element {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await DataFetcherJson({url: url}) as T;
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    if (url && !data) {
      fetchData();
    }
  }, [url]); 

  if (loading) {
    return  <>{renderLoading || <p>Loading...</p>}</>;
  }

  if (error) {
    return <>{renderError(error)}</>;
  }

  if (data) {
    return <>{renderData(data)}</>;
  }
  return <></>;
}

export default DataFetcherMarkup;