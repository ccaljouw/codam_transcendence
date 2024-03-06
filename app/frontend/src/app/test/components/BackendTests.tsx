'use client'
import React, { useEffect, useState } from 'react';
import TestOutput from './TestOutput';

interface DataFormat {
  msg: string;
}

function BackendTests() {
  const [data, setData] = useState<DataFormat | null>(null);

  useEffect(() => {
    //todo: use generic data fetcher
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/test/backend');
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (data === null) {
      fetchData();
    }
  }, []);

  return (
    <div>
      <h1>Backend tests</h1>
      {data === null ? (
        <p>Running tests...</p>
      ) : (
        <>
          <TestOutput />
        </>
      )}
    </div>
  );
}

export default BackendTests;
