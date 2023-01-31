const API_URL = 'http://152.89.247.244:5000/api/users/';

export const login = async (
    email: string,
    password: string
) => {
    const info = {
        email,
        password
    }
    let result;
    await fetch(API_URL + 'login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
    }).then((response) => {
        return response.json();
    }).then((data) => {
        result = data;
    }).catch((err) => result = err);
    return result;
}

export const register = async (
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
    let result;
    await fetch(API_URL + 'register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
    }).then((response) => {
        return response.json();
    }).then((data) => {
        result = data;
    }).catch((err) => result = err);
    return result;
}

export const sendConfirmCode = async (
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    code: number
) => {
    const info = {
        id: id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        code: code
    }
    let result;
    await fetch(API_URL + 'sendMail', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
    }).then((res) => {
        return res.json()
    }).then((data) => {
        result = data;
    }).catch((err) => result = err)
    return result;
}

export const checkConfirmCode = async (
    confirmCode: string,
    id?: string
) => {
    const info = {
        code: confirmCode,
        id: id
    }
    let result;
    await fetch(API_URL + 'checkCode', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
    }).then((res) => {
        return res.json()
    }).then((data) => {
        result = data;
    }).catch((err) => result = err)
    return result;
}

export const logout = () => {
    sessionStorage.removeItem('user');
}

export const getCurrentUser = () => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);

    return null;
}

export const loginWithMetamask = async (account: string) => {
    let nonce;
    await fetch(API_URL + `/${account}/nonce`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then((response) => {
        return response.json();
    }).then((data) => {
        nonce = data;
    }).catch((err) => err);

}