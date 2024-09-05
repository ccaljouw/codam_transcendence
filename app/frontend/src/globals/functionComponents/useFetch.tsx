import { useEffect, useState } from "react";

export type fetchProps<T> = {
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
    } : fetchProps<T> ) : Promise<void> => {
        setIsLoading(true);
        try {
            let requestContent: any = null;
            const headers: HeadersInit = {};
            if (!(payload instanceof FormData)) {
              headers['Content-Type'] = 'application/json';
              requestContent = JSON.stringify(payload);
            } else {
              requestContent = payload;
            }

            const response = await fetch(url, {
                method: fetchMethod,
                headers,
                credentials: 'include',
                body: requestContent,
            });
            if (!response.ok) {
              let errorMessage = `Response not ok: ${response.status} - ${response.statusText}`;
              try {
                const errorResponse = await response.json();
                if (errorResponse.message) {
                  errorMessage = `${response.status} - ${errorResponse.message}`;
                }
              } catch (jsonError) {
                console.log('Error parsing JSON response', jsonError);
              }
              throw new Error(errorMessage);
            }
            setData(await response.json() as U);
        } catch (e: any) {
            console.log("useFetch error: ", e);
            setError(e);
        } finally {
            setIsLoading(false);
        }
    };
    return ({data, isLoading, error, fetcher});
};

//TODO: Jorien, check if fetchProps and fetchOutput should be types or interfaces
