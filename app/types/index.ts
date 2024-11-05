export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Product {
  id: number;
  title: string;
  brand: string;
  price: number;
  stock: number;
  description: string;         // Nova propriedade para descrição do produto
  category: string;            // Nova propriedade para categoria do produto
  discountPercentage: number;  // Nova propriedade para a porcentagem de desconto
  rating: number;              // Nova propriedade para a avaliação do produto
  weight: number;              // Nova propriedade para o peso do produto em gramas
  dimensions: Dimensions;      // Nova propriedade para as dimensões do produto
}
