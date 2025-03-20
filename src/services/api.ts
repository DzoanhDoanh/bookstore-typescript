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
export const getBooksApi = (query: string) => {
    return axios.get<IBackendRes<IBook[]>>(`/books?_page=1&${query}`);
};
export const getBookByIdApi = (id: string) => {
    return axios.get<IBackendRes<IBook>>(`/books/${id}`);
};
export const getCategoryApi = () => {
    const urlBackend = `/category`;
    return axios.get<IBackendRes<ICategory[]>>(urlBackend);
};
export const getCategoryByIdApi = (id: string) => {
    const urlBackend = `/category/${id}`;
    return axios.get<IBackendRes<ICategory>>(urlBackend);
};
export const addBookApi = (
    thumbnail: string,
    slider: string[],
    mainText: string,
    author: string,
    price: number,
    quantity: number,
    category: string,
) => {
    const urlBackend = `/660/books`;
    return axios.post<IBackendRes<IBook>>(urlBackend, {
        thumbnail,
        slider,
        mainText,
        author,
        price,
        sold: 10,
        quantity,
        category,
        updateAt: new Date(),
        createAt: new Date(),
    });
};
export const updateBookApi = (
    id: string,
    thumbnail: string,
    slider: string[],
    mainText: string,
    author: string,
    price: number,
    quantity: number,
    category: string,
) => {
    const urlBackend = `/660/books/${id}`;
    return axios.put<IBackendRes<IBook>>(urlBackend, {
        thumbnail,
        slider,
        mainText,
        author,
        price,
        sold: 10,
        quantity,
        category,
        updateAt: new Date(),
    });
};
export const deleteBookApi = (id: string) => {
    const urlBackend = `/660/books/${id}`;
    return axios.delete<IBackendRes<IBook>>(urlBackend);
};
export const getCartsApi = () => {
    const urlBackend = `/660/carts`;
    return axios.get<IBackendRes<ICart[]>>(urlBackend);
};
export const addToCartApi = (quantity: number, detail: IBook) => {
    const urlBackend = `/660/carts`;
    return axios.post<IBackendRes<ICart>>(urlBackend, { quantity, detail });
};
export const deleteCartByIdApi = (id: string) => {
    const urlBackend = `/660/carts/${id}`;
    return axios.delete<IBackendRes<ICart>>(urlBackend);
};
export const updateQuantityCart = (id: string, quantity: number) => {
    const urlBackend = `/660/carts/${id}`;
    return axios.patch<IBackendRes<ICart>>(urlBackend, {
        quantity,
    });
};
export const postOrderApi = (
    userId: string,
    address: string,
    detail: ICart[],
    name: string,
    phone: string,
    totalPrice: number,
    type: string,
) => {
    const urlBackend = `/660/orders`;
    return axios.post<IBackendRes<IOrder>>(urlBackend, {
        userId,
        address,
        detail,
        name,
        phone,
        totalPrice,
        type,
        createAt: new Date(),
    });
};
export const getOrderById = (id: string) => {
    const urlBackend = `/660/orders/${id}`;
    return axios.get<IBackendRes<IOrder>>(urlBackend);
};
export const getOrderByUserId = (id: string) => {
    const urlBackend = `/660/orders?userId=${id}`;
    return axios.get<IBackendRes<IOrder[]>>(urlBackend);
};
