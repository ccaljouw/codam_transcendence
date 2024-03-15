"use client";
import { useEffect } from 'react';
import { constants } from '@global/constants.globalvar';
import useFetch from '@global/functionComponents/useFetch';

interface DataFormat { //todo: JMA: remove this?
  msg: string;
}

export default function Seed() {
    const {data, isLoading, error, fetcher} = useFetch<null, DataFormat>();

    useEffect(() => {
        seedDatabase();
    }, []);

    const seedDatabase = async () => {
        await fetcher({url: constants.BACKEND_BASEURL + 'seed'});
    }

  return (
    <>
      <h1>Seed database</h1>
      {isLoading && <p>Seeding database...</p>}
      {error && <p>Error: {error.message}</p>}
      {data != null && <p>{data.msg}</p>}
    </>
  );
}

//todo: JMA: remove at all or change url to constants url