import { useState } from "react";

type fetchProps<T> = {
    url: string,
    fetchMethod?: string,
    payload?: T | null,
}

type fetchOutput<T, U> = {
    data: U | null,
    isLoading: boolean,
    error: Error | null,
    fetcher: ({url, fetchMethod, payload}: fetchProps<T>) => Promise<void>,
}

export default function useFetch<T, U>(): fetchOutput<T, U> {
    const [data, setData] = useState<U | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetcher = async ({
        url,
        fetchMethod,
        payload,
    }: fetchProps<T> ): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await fetch(url, {
                method: fetchMethod,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Response not ok: " + response.status + ": " + response.statusText);
            }

            setData(await response.json() as U);
        } catch (e: any) {
            console.log("useFetch error: ", e);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };
    return ({data, isLoading, error, fetcher});
};

//todo: check if fetchProps and fetchOutput should by types or interfaces
