import Cookies from 'js-cookie';
import { NavigateFunction } from "react-router-dom";

export const buildExtendedFetch = (navigate?: NavigateFunction) => {
    const nativeFetch = window.fetch;
    const extendedFetch = async (
        url: string,
        options: RequestInit = {}
    ): Promise<Response> => {
        try {
            const defaultHeaders = {
                "Content-type": "application/json; charset=UTF-8",
                Accept: 'application/json',
            } as any;
    
            const token = Cookies.get('auth');
    
            if (token) {
                defaultHeaders['X-Authorization'] = `Bearer ${token}`;
            }
            const extendedOptions: RequestInit = {
                ...options || {},
                headers: {
                    ...defaultHeaders,
                    ...(options.headers || {}),
                },
            };

            const response = await nativeFetch(url, extendedOptions);

            if (!response.ok) {
                if (response.status === 401) {
                    Cookies.remove('auth');
                    if (navigate) {
                        navigate('/login');
                    } else {
                        console.error('Navigate function is not provided');
                    }
                }
                // throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    // @ts-ignore Override the global fetch function with the extended version
    window.fetch = extendedFetch;
}
