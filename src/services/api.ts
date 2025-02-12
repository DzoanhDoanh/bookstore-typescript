import axios from './axios.customize';

export const loginApi = (username: string, password: string) => {
    return axios.post<IBackendRes<IAuth>>('/login', { email: username, password });
};
export const registerApi = (
    fullName: string,
    email: string,
    password: string,
    phone: string,
    role?: string,
    avatar?: string,
) => {
    const urlBackend = '/register';
    return axios.post<IBackendRes<IAuth>>(urlBackend, {
        fullName,
        email,
        password,
        phone,
        role: role ? role : 'user',
        avatar: avatar ? avatar : 'user.png',
        originalPass: password,
        createAt: new Date(),
    });
};
export const getUserByIdApi = (id: string) => {
    return axios.get<IBackendRes<IUser>>(`/660/users/${id}`);
};

export const getUsersApi = (query: string) => {
    return axios.get<IBackendRes<IUser>>(`/660/users?_page=1&_limit=100${query}`);
};

export const getAllUsers = () => {
    return axios.get<IBackendRes<IUser>>('/660/users');
};
export const importUserApi = (
    fullName: string,
    email: string,
    phone: string,
    password?: string,
    role?: string,
    avatar?: string,
) => {
    const urlBackend = '/register';
    return axios.post<IBackendRes<IAuth>>(urlBackend, {
        fullName,
        email,
        phone,
        password: password ? password : '123456',
        role: role ? role : 'user',
        avatar: avatar ? avatar : 'user.png',
        originalPass: password ? password : '123456',
        createAt: new Date(),
    });
};
export const updateUserApi = (
    id: string,
    email: string,
    password: string,
    fullName: string,
    phone: string,
    role: string,
    avatar?: string,
) => {
    const urlBackend = `/660/users/${id}`;
    return axios.put<IBackendRes<IAuth>>(urlBackend, {
        email,
        password,
        fullName,
        phone,
        role,
        avatar: avatar ? avatar : 'user.png',
        originalPass: password,
        createAt: new Date(),
    });
};
export const deleteUserApi = (id: string) => {
    const urlBackend = `/660/users/${id}`;
    return axios.delete<IBackendRes<IAuth>>(urlBackend);
};
