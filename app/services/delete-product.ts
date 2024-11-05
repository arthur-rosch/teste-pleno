export const deleteProduct = async (productId: string) => {
  try {
    const response = await fetch(`https://dummyjson.com/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Produto deletado:', data);
    return data; // Retorna os dados da resposta, se necessário
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    throw error; // Rejeta o erro para tratamento posterior
  }
};
