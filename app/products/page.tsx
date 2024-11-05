'use client'

import { Product } from '@/app/types';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ProductTable } from './components';
import { getProducts } from '@/app/services/get-products';
import { cardVariants, listItensDelay } from '../animations';
import { Button, Header, Input, Sidebar } from '@/app/components';
import { CreateProductModal } from './components/createProductModal';
import { useRouter } from 'next/navigation';


const Products = () => {
  const router = useRouter();
  const [search, setSearch] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');

      if (email !== 'admin@admin.com' || password !== 'admin') {
        router.push('/login');
      }

      const loadProducts = async () => {
        const data = await getProducts();
        setProducts(data);
      };

      loadProducts();
  }, [router]);

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const filteredProducts = products.filter((product) => {
    const normalizedSearch = search.toLowerCase().trim();
    const normalizedTitle = product.title ? product.title.toLowerCase() : '';
    const normalizedBrand = product.brand ? product.brand.toLowerCase() : '';
    return normalizedTitle.includes(normalizedSearch) || normalizedBrand.includes(normalizedSearch);
  });

  return (
    <div className="w-full bg-[#121212] flex">
      <Sidebar />
      <section className="w-full h-full mx-8">
        <Header />
        <div className="w-full h-full flex flex-col items-start justify-center mt-10 overflow-auto">
          <div className='w-full flex gap-4'>
            <Input
              type="text"
              value={search}
              animation={true}
              variants={listItensDelay}
              className="p-2 mb-4 border rounded w-full"
              placeholder="Buscar por Título ou Marca"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              type="button"
              variant="primary"
              animation={true}
              variants={cardVariants}
              className="w-[25%] flex items-center justify-center py-3 px-4 h-10"
              onClick={() => setIsModalOpen(true)}
            >
              Adicionar novo produto
            </Button>
          </div>
          <motion.div className="w-full mt-6" variants={listItensDelay}>
            <ProductTable data={filteredProducts} total={filteredProducts.length} setProducts={setProducts}/>
          </motion.div>
        </div>
        {isModalOpen && (
          <CreateProductModal
            isModalOpen={isModalOpen}
            onCreate={handleAddProduct}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </section>
    </div>
  );
};

export default Products;
