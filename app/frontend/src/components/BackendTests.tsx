// 'use client'
import React from 'react';
import { useState } from 'react';
import DataFetcher from './DataFetcher';

interface DataFormat {
  msg: string;
}

function BackendTests() {
  const [sessionData, setSessionData] = useState<any | null>(null);

  const handleDataLoaded = (loadedData : any) => {
    // Save the data for the current session
    setSessionData(loadedData);
  };
  
  return (
    <div>
      <h1>Backend tests</h1>
      <DataFetcher<DataFormat>
        url="http://localhost:3001/test/backend"
        renderLoading={<p>Running tests...</p>}
        renderError={(error) => <p>Custom error message: {error.message}</p>}
        renderData={(data) => <pre>{ data.msg }</pre>}
        onDataLoaded={handleDataLoaded}
      />
      {sessionData && (
        // Display the saved data for the current session
        <div>
          <h2>Saved Data for the Session:</h2>
          <pre>{JSON.stringify(sessionData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default BackendTests;