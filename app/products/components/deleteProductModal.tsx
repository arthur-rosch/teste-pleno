import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { cardVariants } from '../../animations';
import { deleteProduct } from '../../services/delete-product';
import { CustomModal, Button, toastSuccess, toastError } from '../../components'; // Importar o toastSuccess

interface DeleteProductModalProps {
  product: Product;
  isModalOpen: boolean;
  onDelete: (productId: number) => void
  setIsModalOpen: (value: boolean) => void;

}

export const DeleteProductModal: FC<DeleteProductModalProps> = ({
  product,
  onDelete,
  isModalOpen,
  setIsModalOpen,
}) => {
  const handleDelete = async () => {
    try {
      await deleteProduct(String(product.id));
      toastSuccess({
        text: 'Produto "${product.title}" deletado com sucesso!`'
      });
      onDelete(product.id)
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
      
    } catch (error) {
      toastError({
        text: `Falha ao deletar o produto ${error}`
      });
      
    }
  };

  return (
    <CustomModal.Root
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      styles="h-auto w-[30rem] flex flex-col m-auto"
    >
      <CustomModal.Title
        title="Confirmar Deleção"
        setIsOpen={setIsModalOpen}
        subTitle={`Tem certeza que deseja deletar o produto ${product.title}?`}
      />
      <>
        <motion.div
          className="w-full flex items-center justify-center py-6 px-8 gap-2 border-t-[1px] border-solid border-[#333333]"
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Button
            type="button"
            variant="secondary"
            className="w-full flex items-center justify-center py-3 px-4 h-10"
            onClick={() => setIsModalOpen(false)}

          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            className="w-full flex items-center justify-center py-3 px-4 h-10"
          >
            Confirmar
          </Button>
        </motion.div>
      </>
    </CustomModal.Root>
  );
};
