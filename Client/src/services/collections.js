//import { getProfileData } from "./authService";
import {getAuthorizationToken} from "./utils.js";

const baseUrl = "http://localhost:3000/protected/myOffers"

const getHeaders = (token) => {
    return {
        "Content-type": "application/json",
        "X-Authorization": getAuthorizationToken(token),
    }
}
export const getMyOffers = async (token) => {
    const response = await fetch(`${baseUrl}`, {
        method: "GET",
        headers: getHeaders(token)
    })

    if (response.status === 404) {
        return []
    }
    if (!response.ok) {
        throw await response.json()
    }

    return await response.json()
};

export const addNewOffer = async (propertyDetails, token) => {
    const response = await fetch(`${baseUrl}`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(propertyDetails)
    })
    if (!response.ok) {
        throw await response.json()
    }

    return await response.json()
}

export async function getMyOffer(id, token) {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "GET",
        headers: getHeaders(token)
    });

    if (response.status === 404) {
        return {}
    }
    if (!response.ok) {
        throw await response.json()
    }

    return await response.json();
}

export async function editMyOffer(id, token, editedPropertyData) {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify(editedPropertyData)
    });

    if (response.status === 404) {
        return {}
    }

    return await response.json();
}

export const deleteOffer = async (_id, token) => {
    const response = await fetch(`${baseUrl}/${_id}`, {
        method: "DELETE",
        headers: getHeaders(token),
    })

    if (!response.ok) {
        throw await response.json()
    }

    return await response.json()
}
