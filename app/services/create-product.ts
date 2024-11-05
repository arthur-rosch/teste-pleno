import { Product } from '@/app/types';

export async function createProduct(data: Omit<Product, 'id'>): Promise<Product> {
  const response = await fetch('https://dummyjson.com/products/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erro ao criar o produto');
  }

  return response.json();
}
