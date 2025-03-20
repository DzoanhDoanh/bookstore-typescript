export {};
declare global {
    interface IBackendRes<T> {
        [x: string]: string;
        status: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        results: T[];
    }

    interface IAuth {
        accessToken: string;
        user: {
            email: string;
            phone: string;
            fullName: string;
            role: string;
            avatar: string;
            id: string;
            createAt: string;
        };
    }

    interface IUser {
        email: string;
        phone: string;
        fullName: string;
        role: string;
        avatar: string;
        id: string;
        createAt: string;
        originalPass?: string;
    }

    interface IBook {
        id: string;
        thumbnail: string;
        slider: string[];
        mainText: string;
        author: string;
        price: number;
        sold: number;
        quantity: number;
        category: string;
        createAt: string;
        updateAt: string;
    }
    interface ICategory {
        id: string;
        categoryName: string;
    }
    interface ICart {
        id: string;
        quantity: number;
        detail: IBook;
    }
    interface IOrder {
        id: string;
        userId: string;
        address: string;
        detail: ICart[];
        name: string;
        phone: string;
        totalPrice: number;
        type: string;
    }
}
