import { type FC } from 'react';
import { motion } from 'framer-motion';
import { cardVariants } from '../../animations';
import { CustomModal, Button, Input } from '../../components';
import { Product } from '../../types';

interface ViewProductModalProps {
  product: Product;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

export const ViewProductModal: FC<ViewProductModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  product,
}) => {
    console.log(product)
  const productDetails = [
    { id: 'product-id', label: 'ID', value: product.id.toString() },
    { id: 'product-title', label: 'Título', value: product.title },
    { id: 'product-brand', label: 'Marca', value: product.brand },
    { id: 'product-price', label: 'Preço', value: `R$ ${product.price.toFixed(2)}` },
    { id: 'product-stock', label: 'Estoque', value: product.stock.toString() },
    { id: 'product-description', label: 'Descrição', value: product.description },
    { id: 'product-category', label: 'Categoria', value: product.category },
    { id: 'product-discount', label: 'Desconto', value: `${product.discountPercentage}% de desconto` },
    { id: 'product-rating', label: 'Avaliação', value: `Avaliação: ${product.rating}` },
    { id: 'product-weight', label: 'Peso', value: `${product.weight} g` },
  ];

  return (
    <CustomModal.Root
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      styles="h-auto w-[40rem] flex flex-col m-auto"
    >
      <CustomModal.Title
        title="Detalhes do Produto"
        setIsOpen={setIsModalOpen}
        subTitle="Veja aqui as informações do produto selecionado."
      />
      <>
        <motion.div
          className="w-full max-h-[40rem] overflow-auto p-6 grid grid-cols-2 gap-4" // Usando grid com 2 colunas
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          {productDetails.map((detail) => (
            <div key={detail.id} className="flex flex-col">
              <label htmlFor={detail.id} className="mb-1 font-semibold">
                {detail.label}
              </label>
              <Input
                id={detail.id}
                value={detail.value}
                placeholder={detail.label}
                disabled={true}
                className="w-full h-10 p-2"
              />
            </div>
          ))}
        </motion.div>

        <motion.div
          className="w-full flex items-center justify-center py-6 px-8 border-t-[1px] border-solid border-[#333333]"
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Button
            type="button"
            variant="primary"
            animation={true}
            variants={cardVariants}
            className="w-full flex items-center justify-center py-3 px-4 h-10"
            onClick={() => setIsModalOpen(false)}
          >
            Fechar
          </Button>
        </motion.div>
      </>
    </CustomModal.Root>
  );
};
