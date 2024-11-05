import { Product } from '../types';

interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`https://dummyjson.com/products?limit=0`);
  
  const data: ProductResponse = await response.json();
  
  return data.products;
};
