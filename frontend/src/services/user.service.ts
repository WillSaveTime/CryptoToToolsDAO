import authHeader from "./auth-header";

const API_URL = 'http://152.89.247.244:5000/api/users/';

export const getPublicContent = async () => {
    const response = await fetch(API_URL + 'all', {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

export const getUserBoard = async () => {
    const response = await fetch(API_URL + 'me', {
        method: 'get',
        headers: authHeader()
    });
    return response.json();
}

export const getModeratorBoard = async () => {
    const response = await fetch(API_URL + 'mod', {
        method: 'get',
        headers: authHeader()
    });
    return response.json();
}

export const getAdminBoard = async () => {
    const response = await fetch(API_URL + 'admin', {
        method: 'get',
        headers: authHeader()
    });
    return response.json();
}


export const changePassword = async (
    email: string,
    current_password: string,
    password: string,
    password_confirm: string,
) => {
    const info = {
        email,
        current_password,
        password,
        password_confirm
    }
    const response = await fetch(API_URL + 'change-password', {
        method: 'POST',
        headers: {
            ...authHeader(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
    });
    return response.json();
}