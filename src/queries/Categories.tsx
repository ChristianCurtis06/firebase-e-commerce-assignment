import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchCategories = async (): Promise<string[]> => {
    const response = await axios.get('https://fakestoreapi.com/products/categories');
    return response.data;
};

const useCategories = () => {
    return useQuery<string[]>({
        queryKey: ['categories'],
        queryFn: fetchCategories
    });
};

export default useCategories;