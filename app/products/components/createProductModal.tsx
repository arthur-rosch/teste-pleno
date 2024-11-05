import { z } from 'zod';
import { FC } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProduct } from '../../services/create-product';
import { CustomModal, Button, Input, toastError, toastSuccess } from '../../components';
import { Product } from '../../types';
import { cardVariants } from '../../animations';

const productSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  brand: z.string().min(1, 'Marca é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  weight: z.string({ invalid_type_error: 'Peso deve ser um número' }),
  price: z.string({ invalid_type_error: 'Preço deve ser um número' }),
  stock: z.string({ invalid_type_error: 'Estoque deve ser um número' }),
  discountPercentage: z.string({ invalid_type_error: 'Desconto deve ser um número' }),
});

type ProductSchema = z.infer<typeof productSchema>;
type ProductField = keyof ProductSchema;

interface CreateProductModalProps {
  isModalOpen: boolean;
  onCreate: (product: Product) => void;
  setIsModalOpen: (value: boolean) => void;
}

export const CreateProductModal: FC<CreateProductModalProps> = ({ isModalOpen, onCreate, setIsModalOpen }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductSchema) => {
    try {
      const transformedData: Product = {
          ...data,
          price: Number(data.price),
          stock: Number(data.stock),
          discountPercentage: Number(data.discountPercentage),
          weight: Number(data.weight),
          rating: 0,
          dimensions: { width: 0, height: 0, depth: 0 },
          id: Math.random(),
      };
      console.log(transformedData);
      const newProduct = await createProduct(transformedData);
      onCreate(newProduct);

      toastSuccess({ text: 'Produto criado com sucesso!' });

      setTimeout(() => {
        setIsModalOpen(false);
        reset();
      }, 2000);
    } catch (error) {
      toastError({ text: `Falha ao criar o produto ${error}` });
    }
  };

  const inputFields: { id: string; label: string; name: ProductField; type: string }[] = [
    { id: 'product-title', label: 'Título', name: 'title', type: 'text' },
    { id: 'product-brand', label: 'Marca', name: 'brand', type: 'text' },
    { id: 'product-price', label: 'Preço', name: 'price', type: 'number' },
    { id: 'product-stock', label: 'Estoque', name: 'stock', type: 'number' },
    { id: 'product-description', label: 'Descrição', name: 'description', type: 'text' },
    { id: 'product-category', label: 'Categoria', name: 'category', type: 'text' },
    { id: 'product-discount', label: 'Desconto', name: 'discountPercentage', type: 'number' },
    { id: 'product-weight', label: 'Peso', name: 'weight', type: 'number' },
  ];

  return (
    <CustomModal.Root
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      styles="h-auto w-[40rem] flex flex-col m-auto"
    >
      <CustomModal.Title
        title="Criar Produto"
        setIsOpen={setIsModalOpen}
        subTitle="Insira as informações do novo produto."
      />
      <>
        <motion.div
          className="w-full max-h-[40rem] overflow-auto p-6 grid grid-cols-2 gap-4"
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          {inputFields.map(({ id, label, name, type }) => (
            <div key={id} className="flex flex-col">
                <label htmlFor={id} className="mb-1">{label}</label>
                <div className="flex flex-col">
                <Input
                    id={id}
                    type={type}
                    placeholder={label}
                    className="w-full h-10 mb-1 p-2"
                    animation={true}
                    variants={cardVariants}
                    {...register(name)}
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
