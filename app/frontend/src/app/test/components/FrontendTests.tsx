'use client'
import React, { useEffect, useState } from 'react';
import TestOutput from './TestOutput';

interface DataFormat {
  msg: string;
}

function FrontendTests() {
  const [data, setData] = useState<DataFormat | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/test/frontend');
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
      <h1>Frontend tests</h1>
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

export default FrontendTests;