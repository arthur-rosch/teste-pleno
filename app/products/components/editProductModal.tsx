import { z } from 'zod';
import { FC, useEffect } from 'react';
import { Product } from '../../types';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { cardVariants } from '../../animations';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProduct } from '../../services/update-product';
import { CustomModal, Button, Input, toastError, toastSuccess } from '../../components';

const productSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  brand: z.string().min(1, 'Marca é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  price: z.string().min(1, 'Preço deve ser um número positivo'),
  stock: z.string().min(1, 'Estoque deve ser um número inteiro não negativo'),
  discountPercentage: z.string().min(1, 'Desconto deve ser um número positivo'),
});

type ProductSchema = z.infer<typeof productSchema>;

interface EditProductModalProps {
  product: Product;
  isModalOpen: boolean;
  onEdit: (product: Product) => void
  setIsModalOpen: (value: boolean) => void;
}

export const EditProductModal: FC<EditProductModalProps> = ({
  onEdit,
  product,
  isModalOpen,
  setIsModalOpen,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductSchema) => {
    try {
      const transformedData = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        discountPercentage: Number(data.discountPercentage),
      };

      const newProduct = await updateProduct(product.id, transformedData);
      onEdit(newProduct)
      toastSuccess({ text: 'Produto atualizado com sucesso!' });


      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Erro ao atualizar o produto:', error);
      toastError({ text: 'Erro ao atualizar o produto. Tente novamente.' });
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      setValue('title', product.title);
      setValue('brand', product.brand);
      setValue('price', product.price.toString());
      setValue('stock', product.stock.toString());
      setValue('description', product.description);
      setValue('category', product.category);
      setValue('discountPercentage', product.discountPercentage.toString());
    }
  }, [isModalOpen, product, setValue]);

  const inputFields: { id: string; label: string; name: keyof ProductSchema; type: string }[] = [
    { id: 'product-title', label: 'Título', name: 'title', type: 'text' },
    { id: 'product-brand', label: 'Marca', name: 'brand', type: 'text' },
    { id: 'product-price', label: 'Preço', name: 'price', type: 'text' }, 
    { id: 'product-stock', label: 'Estoque', name: 'stock', type: 'text' }, 
    { id: 'product-description', label: 'Descrição', name: 'description', type: 'text' },
    { id: 'product-category', label: 'Categoria', name: 'category', type: 'text' },
    { id: 'product-discount', label: 'Desconto', name: 'discountPercentage', type: 'text' }, 
  ];

  return (
    <CustomModal.Root
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      styles="h-auto w-[40rem] flex flex-col m-auto"
    >
      <CustomModal.Title
        title="Editar Produto"
        setIsOpen={setIsModalOpen}
        subTitle="Edite as informações do produto selecionado."
      />
      <>
        <motion.div
          className="w-full max-h-[40rem] overflow-auto p-6 grid grid-cols-2 gap-4"
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Input
            id="product-id"
            value={product.id.toString()}
            placeholder="ID"
            disabled={true}
            className="w-full h-10 mt-2 mb-2 p-2"
          />
          {inputFields.map(({ id, label, name, type }) => (
            <div key={id} className="flex flex-col">
              <label htmlFor={id} className="mb-1">{label}</label>
              <div className="flex flex-col">
                <Input
                  id={id}
                  type={type}
                  {...register(name)}
                  placeholder={label}
                  className={`w-full h-10 mb-1 p-2 ${errors[name] ? 'border-red-500' : ''}`}
                />
                {errors[name] && <p className="text-red-500 text-sm">{errors[name]?.message}</p>}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="w-full flex items-center justify-center py-6 px-8 gap-4 border-t-[1px] border-solid border-[#333333]"
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
            onClick={handleSubmit(onSubmit)}
          >
            Salvar
          </Button>
          <Button
            type="button"
            variant="secondary"
            animation={true}
            variants={cardVariants}
            className="w-full flex items-center justify-center py-3 px-4 h-10"
            onClick={() => setIsModalOpen(false)}
          >
            Cancelar
          </Button>
        </motion.div>
      </>
    </CustomModal.Root>
  );
};
