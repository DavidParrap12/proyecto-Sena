import axios from 'axios';

const API = 'http://localhost:3005/api';

export const loginRequest = async (email, password) => 
    axios.post(`${API}/auth/login`, { email, password }, { withCredentials: true });

export const verifyTokenRequest = async () => 
    axios.get(`${API}/auth/verify`, { withCredentials: true });

export const registerRequest = async (user) => {
    return await axios.post(`${API}/auth/register`, user);
};

export const logoutRequest = async () => {
    return await axios.post(`${API}/auth/logout`, null, {
        withCredentials: true
    });
};