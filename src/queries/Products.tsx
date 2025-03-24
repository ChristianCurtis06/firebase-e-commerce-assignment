import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type Product = {
    id: number;
    title: string;
    price: string;
    category: string;
    description: string;
    rating: { rate: number, count: number };
    image: string;
    quantity?: number;
};

const fetchProducts = async (): Promise<Product[]> => {
    const response = await axios.get('https://fakestoreapi.com/products');
    return response.data;
};

export const useProducts = () => {
    return useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: fetchProducts
    });
};

const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
    const response = await axios.get(`https://fakestoreapi.com/products/category/${category}`);
    return response.data;
};

export const useProductsByCategory = (category: string) => {
    return useQuery<Product[]>({
        queryKey: ['products', category],
        queryFn: () => fetchProductsByCategory(category),
        enabled: !!category
    });
};