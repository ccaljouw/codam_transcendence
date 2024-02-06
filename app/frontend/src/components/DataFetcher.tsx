import React, { useState, useEffect } from 'react';

interface DataFetcherProps<T> {
  url: string;
  renderLoading?:  React.ReactNode;
  renderError?: (error: any) => React.ReactNode;
  renderData: (data: T) => React.ReactNode;
  onDataLoaded: (loadedData: any) => void;
}

function DataFetcher<T>({
  url,
  renderLoading,
  renderError = (error) => <p>Error: {error.message}</p>,
  renderData,
  onDataLoaded,
}: DataFetcherProps<T>): JSX.Element {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
      
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
        onDataLoaded(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onDataLoaded]);

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

export default DataFetcher;