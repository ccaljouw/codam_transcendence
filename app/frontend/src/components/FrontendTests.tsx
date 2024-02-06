'use client'
import React from 'react';
import DataFetcher from 'src/components/DataFetcher';

interface DataFormat {
  msg: string;
}

function FrontendTests() {
  return (
    <div className="component">
      <h1>Frontend tests</h1>
      {/* <DataFetcher<DataFormat>
        url="http://localhost:3001/test/frontend"
        renderLoading={<p>Running tests...</p>}
        renderError={(error) => <p>Custom error message: {error.message}</p>}
        renderData={(data) => <pre>{ data.msg }</pre>}
      /> */}
    </div>
  );
}

export default FrontendTests;