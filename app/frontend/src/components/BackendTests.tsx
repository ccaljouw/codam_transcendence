// 'use client'
import React from 'react';
import DataFetcher from './DataFetcher';

interface DataFormat {
  msg: string;
}

function BackendTests() {
  
  return (
    <div className="component">
      <h1>Backend tests</h1>
      <DataFetcher<DataFormat>
        url="http://localhost:3001/test/backend"
        renderLoading={<p>Running tests...</p>}
        renderError={(error) => <p>Custom error message: {error.message}</p>}
        renderData={(data) => <pre>{ data.msg }</pre>}
      />
    </div>
  );
};

export default BackendTests;