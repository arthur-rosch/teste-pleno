import { Product } from "../types";

export const updateProduct = async (id: number, updatedData: Partial<Product>): Promise<Product> => {
  const response = await fetch(`https://dummyjson.com/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error('Falha ao atualizar o produto');
  }

  return await response.json();
};