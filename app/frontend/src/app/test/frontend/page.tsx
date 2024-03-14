'use client'
import React, { useEffect, useState } from 'react';
import IframeHolder from '../components/IframeHolder';

interface DataFormat {
  msg: string;
}

export default function FrontendTests() {
  const [data, setData] = useState<DataFormat | null>(null);

  useEffect(() => {
    //todo: use generic data fetcher
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
          <IframeHolder url='http://localhost:3001/test/output' title="Frontend test output" />
        </>
      )}
    </div>
  );
}
