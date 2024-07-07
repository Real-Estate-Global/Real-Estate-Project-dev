import {getAuthorizationToken} from "./utils.js";

const baseUrl = "http://localhost:3000/user"

export async function login(loginData) {
    const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(loginData)
    })

    if (!response.ok) {
        throw await response.json()
    }

    return await response.json()
}

export async function signup(signupData) {
    const response = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(signupData)
    })

    if (!response.ok) {
        throw await response.json()
    }

    return await response.json()
}
export async function logout(token) {
    const response = await fetch(`${baseUrl}/logout`, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "X-Authorization": getAuthorizationToken(token),
        }
    })

    if (response.status === 403) {
        return {}
    }
    if (!response.ok) {
        throw await response.json()
    }
}

export async function getProfileData(token) {
    const response = await fetch(`${baseUrl}/me`, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "X-Authorization": getAuthorizationToken(token),
        }
    })
    if (!response.ok) {
        throw await response.json()
    }

    return await response.json()
}
