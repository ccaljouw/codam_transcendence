'use client'
import React from 'react';
import DataFetcherMarkup from '../../../components/DataFetcherMarkup';

interface DataFormat {
  msg: string;
}

export default function Seed() {
  return (
    <>
      <h1>Seed database</h1>
      <DataFetcherMarkup<DataFormat>
        url="http://localhost:3001/seed"
        renderLoading={<p>Seeding database...</p>}
        renderError={(error) => <p>Custom error message: {error.message}</p>}
        renderData={(data) => <pre>{ data.msg }</pre>}
      />
    </>
  );
}
