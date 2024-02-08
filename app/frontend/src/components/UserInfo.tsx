'use client'
import React, { useState, useEffect } from 'react';
import InfoField from './utils/InfoField';

export default function UserInfo() {
  const [data, setData] = useState< JSON | null >(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => { // Anders opschrijven
    try {
			const userId = sessionStorage.getItem('userId'); // todo: change to token
      const response = await fetch('http://localhost:3001/users/' + userId);
      const result = await response.json();
      setData(result);
      setUserName(result.firstName);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="component">
      <h1>User information</h1>
      {userName?.length > 0 &&
      <table>
        <InfoField name="Avatar" data="Avatar picture" />
        <InfoField name="Username" data={userName}/>
        <InfoField name="Online" data="Online status" />
        <InfoField name="Rank" data={"#" + "1"} />
      </table>
     }
	</div>
  );
}
      // {data ? (<pre>{JSON.stringify(data, null, 2)}</pre>) : (<p>Loading data...</p>)}

// Profile vraags user aan aan de hand van de session token.
// Backend vergelijkt in de backend de session token met de actieve users en stuurt de juiste user terug.
