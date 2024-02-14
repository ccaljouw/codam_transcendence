'use client'
import React, { useState, useEffect } from 'react';

export default function Profile() {
  const [data, setData] = useState< JSON | null >(null);

  useEffect(() => {
	console.log("profile called");
    fetchData();
  }, []);

  const fetchData = async () => { // Anders opschrijven
    try {
			const userId = sessionStorage.getItem('userId');
      const response = await fetch('http://localhost:3001/users/' + userId);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="component">
      <h1>Data from API</h1>
			{data ? (<pre>{JSON.stringify(data, null, 2)}</pre>) : (<p>Loading data...</p>)}
	</div>
  );
}

// Profile vraags user aan aan de hand van de session token.
// Backend vergelijkt in de backend de session token met de actieve users en stuurt de juiste user terug.
