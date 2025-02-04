import axios from './axios.customize';

export const loginApi = (username: string, password: string) => {
    return axios.post<IBackendRes<IAuth>>('/login', { email: username, password });
};
export const registerApi = (fullName: string, email: string, password: string, phone: string) => {
    const urlBackend = '/register';
    return axios.post<IBackendRes<IAuth>>(urlBackend, {
        fullName,
        email,
        password,
        phone,
        role: 'user',
        avatar: 'user.png',
    });
};
export const getUserById = (id: string) => {
    return axios.get<IBackendRes<IUser>>(`/660/users/${id}`);
};
