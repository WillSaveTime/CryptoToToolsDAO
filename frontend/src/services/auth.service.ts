const API_URL = '/api/users/';

export const login = (
    email: string,
    password: string
) => {
    const info = {
        email,
        password
    }
    return fetch(API_URL + 'login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
    });
}

export const register = (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    password_confirm: string
) => {
    const info = {
        firstName,
        lastName,
        email,
        password,
        password_confirm
    }
    return fetch(API_URL + 'register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
    })
    .then((response: any) => {
        return response.json();
    });
}
export const logout = () => {
    localStorage.removeItem('user');
}

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if(userStr) return JSON.parse(userStr);

    return null;
}