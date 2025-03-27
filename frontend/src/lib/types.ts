
export type PostData = {
    url?: string;
    [key: string]: unknown;
}
export type UserData = {
    email: string;
    name: string;
    username: string;
    role: string;
    status: number;
    id: number;
};

export type Products = {
    image?:string,
    id?: number,
    photo?:string,
    name?: string,
    description?: string,
    category_id?: number,
    price?:number,
    brand_id?:number,
    name_brand?:string,
    price_offert?:number,
    stock?:number | null,
}
export type Categories = {
    id_category?: number,
    name_cat?: string,
    description?: string,
}
export type Brand  = {
    id_brand?: number,
    name_brand?:string,
}
export type AmountDate = {
    id?:number,
    total?:number,
    payment_method?:number,
    date?:string,
}