import { LoginDataType } from "../types/LoginDataType";
import Cookies from "js-cookie";

export const loginSubmitHandler =
    async (options: { values: LoginDataType; login: (values: LoginDataType) => Promise<{ data: string }> | any; successCb?: (accessToken: string) => void }) => {
        try {
            const { values, successCb, login } = options;
            const result = await login(values);

            if (result.data) {
                const expires = new Date();
                expires.setDate(expires.getDate() + 7);
                Cookies.set("auth", result.data, { expires, path: "/" });

                successCb && successCb(result.data);
            }
        } catch (e: any) {
            console.error("Error::loginSubmitHandler", e)
        }
    }