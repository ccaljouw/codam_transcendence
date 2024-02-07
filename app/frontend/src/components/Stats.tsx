"use client";
import InfoField from "./utils/InfoField";
import { useState, useEffect }from 'react';

export default function Stats() {
    const [isClient, setIsClient] = useState<Boolean>(false);

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <>
            <div className="component">
                <h1>User stats</h1>
                {isClient && <table>
                    <InfoField name="Friends" data="Amount of friends" />
                    <InfoField name="Win/Loss ratio" data="1.0" />
                    <InfoField name="Achievements" data="Noob, Diehard, 3 Wins in a row" />
                </table>}
            </div>
        </>
    );
}
