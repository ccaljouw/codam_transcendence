import { useState } from "react";

type fetchProps<T> = {
    url: string,
    fetchMethod?: string,
    payload?: T | null,
}

type fetchOutput<T> = {
    data: T | null,
    isLoading: boolean,
    error: Error | null,
    fetcher: ({url, fetchMethod, payload}: fetchProps<T>) => Promise<void>,
}

export default function useFetch<T>(): fetchOutput<T> {
    const [data, setData] = useState<T | null>(null);
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
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Response not ok in useFetch: " + response.status + ": " + response.statusText);
            }

            setData(await response.json() as T);
        } catch (error: any) { // todo: find out why this needs to be any
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };
    return ({data, isLoading, error, fetcher});
};

//todo: check if fetchProps and fetchOutput should by types or interfaces