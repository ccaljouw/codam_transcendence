'use client'
import React from 'react';
import DataFetcher from './DataFetcher';

interface DataFormat {
  msg: string;
}

function Seed() {
  return (
    <div className="component">
      <h1>Seed database</h1>
      {/* <DataFetcher<DataFormat>
        url="http://localhost:3001/test/seed"
        renderLoading={<p>Seeding database...</p>}
        renderError={(error) => <p>Custom error message: {error.message}</p>}
        renderData={(data) => <pre>{ data.msg }</pre>}
      /> */}
    </div>
  );
}

export default Seed;