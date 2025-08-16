import Cookies from 'js-cookie';
import { NavigateFunction } from "react-router-dom";
import { NotificationManager } from '../components/Notifications';

const nativeFetch = window.fetch;

export const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export class ExtendedFetch {
    public static instance: ExtendedFetch;
    private navigate?: NavigateFunction;
    private setAuth?: (accessToken: string) => void;
    public static fetch: (url: string, options?: RequestInit) => Promise<Response>;

    private constructor(navigate: NavigateFunction, setAuth?: (accessToken: string) => void) {
        this.navigate = navigate;
        this.setAuth = setAuth;
        this.overrideGlobalFetch();
    }

    public static buildInstance(params: { navigate: NavigateFunction, setAuth: (accessToken: string) => void }) {
        if (!ExtendedFetch.instance) {
            ExtendedFetch.instance = new ExtendedFetch(params.navigate, params.setAuth);
        }
    }

    private overrideGlobalFetch() {
        const extendedFetch = async (
            url: string,
            options: RequestInit = {}
        ): Promise<Response> => {
            try {
                console.log('Extended fetch called with URL:', url, 'and options:', options);
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
                        console.log('Unauthorized access - redirecting to login');
                        Cookies.remove('auth');

                        if (this.setAuth) {
                            this.setAuth('');
                        } else {
                            console.error('SetAuth function is not provided');
                        }
                        if (this.navigate) {
                            this.navigate('/login');
                        } else {
                            console.error('Navigate function is not provided');
                        }
                    }
                }

                return response;
            } catch (error) {
                console.error('Fetch error:', error);
                throw error;
            }
        };

        ExtendedFetch.fetch = extendedFetch
    }
}

//@ts-ignore
window.fetch = async (url: string, options?: RequestInit) => {
    while (!ExtendedFetch.instance) {
        await delay(100)
    }
    return await ExtendedFetch.fetch(url, options);
}
