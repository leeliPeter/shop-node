export type Product = {
    productId: number;
    brand?: string;
    name: string;
    price: number;
    discount: number;
    size: string[];
    category: string;
    position?: string;
    image: string[];
    description: string;
    quantity: { size: string, quantity: number }[];
    descriptionImg: string[];
    publishTime: string;
    sale: { date: string, number: number }[];
};

export type Item = {
    product: Product;
    quantity: number;
    size: string;
};

export type Cart = Item[];

export type BuyerInfo = {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    phone: string;
};

export type Order = {
    orderId: string;
    cart: Cart;
    userId?: string;
    status: "unpaid" | "processing" | "shipped" | "finished";
    date: string;
    totalPrice: number;
    buyerInfo: BuyerInfo;
};

export type OrderHistory = Order[];

export type UserInfo = {
    userId: string;
    name: string;
    email: string;
    password: string;
    subscribe?: boolean;
    cart: Cart;
    orderHistory: OrderHistory;
    registerDate: string;
    profile: {
        email: string;
        firstName: string;
        lastName: string;
        birthday: string;
        gender: string;
        phone: string;
        country: string;
        state: string;
        city: string;
        zip: string;
        address: string;
    };
    resetToken?: string;
    resetTokenExpiry?: number;
};

const url: string = 'http://localhost:5173';
export default url;
