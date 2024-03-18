"use client";
import { useEffect } from 'react';
import useFetch from '@ft_global/functionComponents/useFetch';
import IframeHolder from '@ft_global/functionComponents/IframeHolder';
import { constants } from 'src/globals/constants.globalvar';

interface DataFormat { //todo: JMA: remove this?
  msg: string;
}

export default function Test({url, iframeTitle} : {url: string, iframeTitle: string}) : JSX.Element {
  const {data, isLoading, error, fetcher} = useFetch<null, DataFormat>();

  useEffect(() => {
    fetchAllTests();
  }, []);

  const fetchAllTests = async () => {
    await fetcher({url: url});
  }

  return (
    <>
      {isLoading && <p>Running tests...</p>}
      {error != null && <p>Error: {error.message}</p>}
      {data != null && 
          <IframeHolder url= {constants.API_TEST_OUTPUT }  title={iframeTitle} />
      }
    </>
  );
}
