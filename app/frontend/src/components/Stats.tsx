"use client";
// import InfoField from "./utils/InfoField";
import { useState, useEffect }from 'react';

export default function Stats() {
    const [isClient, setIsClient] = useState<Boolean>(false);

    useEffect(() => {
        setIsClient(true)
    }, [])

    // todo: change from table to row with cols 
    return (
        <>
            <h1>User stats</h1>
            {isClient && <table>
                <p>
                    Friends             12 <br/>
                    Win/Loss ratio      1.0 <br/>
                    Achievements        Noob, Diehard, 3 Wins in a row<br/>
                </p>
                {/* <InfoField name="Friends" data="Amount of friends" />
                <InfoField name="Win/Loss ratio" data="1.0" />
                <InfoField name="Achievements" data="Noob, Diehard, 3 Wins in a row" /> */}
            </table>}
        </>
    );
}
