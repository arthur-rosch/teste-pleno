import React, { useMemo, useState } from 'react';
import { Product } from '../../types';
import { motion } from 'framer-motion';
import { Button } from '../../components';
import { listItensDelay } from '../../animations';
import { ViewProductModal, EditProductModal, DeleteProductModal } from './'
import {
  Table,
  Paper,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TableContainer,
  TablePagination,
  TableSortLabel, // Importação para habilitar a ordenação
} from '@mui/material';

interface ProductTableProps {
  data: Product[];
  total: number;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const ProductTable: React.FC<ProductTableProps> = ({ data, total, setProducts }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalState, setModalState] = useState({
    view: false,
    edit: false,
    delete: false,
  });

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({
    key: '',
    direction: null,
  });

  const columns = useMemo(
    () => [
      { id: 'id', label: 'ID' },
      { id: 'title', label: 'Title' },
      { id: 'brand', label: 'Brand' },
      { id: 'price', label: 'Price' },
      { id: 'stock', label: 'Stock' },
      { id: 'actions', label: 'Actions' },
    ],
    []
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openModal = (type: 'view' | 'edit' | 'delete', product: Product) => {
    setSelectedProduct(product);
    setModalState({ ...modalState, [type]: true });
  };

  const closeModal = (type: 'view' | 'edit' | 'delete') => {
    setModalState({ ...modalState, [type]: false });
    setSelectedProduct(null);
  };

  const handleDeleteSuccess = (productId: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  }

  const handleEditSuccess = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)));
  };

  const handleSort = (columnId: string) => {
    setSortConfig((prevSortConfig) => {
      if (prevSortConfig.key === columnId) {
        // Alterna entre 'asc', 'desc' e null para direção de ordenação
        const nextDirection = prevSortConfig.direction === 'asc' ? 'desc' : 'asc';
        return { key: columnId, direction: nextDirection };
      }
      return { key: columnId, direction: 'asc' };
    });
  };

  const sortedData = useMemo(() => {
    const sorted = [...data];
    if (sortConfig.key && sortConfig.direction) {
      sorted.sort((a, b) => {
        const valueA = a[sortConfig.key as keyof Product];
        const valueB = b[sortConfig.key as keyof Product];
        
        if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, page, rowsPerPage]);

  const renderCellContent = (columnId: string, row: Product) => {
    if (columnId === 'actions') {
      return (
        <div className="flex space-x-2">
          <Button
            variant="danger"
            type="button"
            className="p-2"
            onClick={() => openModal('view', row)}
          >
            Ver
          </Button>
          <Button
            variant="danger"
            type="button"
            className="p-2"
            onClick={() => openModal('edit', row)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            type="button"
            className="p-2"
            onClick={() => openModal('delete', row)}
          >
            Deletar
          </Button>
        </div>
      );
    }

    const cellContent = row[columnId as keyof Product];

    // Verifique se o conteúdo da célula é renderizável
    if (typeof cellContent === 'string' || typeof cellContent === 'number') {
      return cellContent; // Valores válidos para renderização
    }

    
    return 'N/A'; // Ou qualquer valor padrão que faça sentido no contexto
  };


  return (
    <motion.div variants={listItensDelay}>
      <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', borderRadius: '10px' }}>
        <Table sx={{ minWidth: 650, backgroundColor: 'transparent' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} className="bg-[#444] text-white font-semibold">
                  {column.id === 'actions' ? (
                    column.label
                  ) : (
                    <TableSortLabel
                      active={sortConfig.key === column.id}
                      direction={sortConfig.key === column.id ? sortConfig.direction ?? 'asc' : 'asc'}
                      onClick={() => handleSort(column.id)}
                      className="text-white"
                    >
                      {column.label}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.id} className="bg-transparent">
                {columns.map((column) => (
                  <TableCell key={column.id} className="text-[#d0d0d0] bg-transparent border-none p-3">
                    {renderCellContent(column.id, row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={columns.length}
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                className="text-white"
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {selectedProduct && (
        <>
          <ViewProductModal
            isModalOpen={modalState.view}
            setIsModalOpen={() => closeModal('view')}
            product={selectedProduct}
          />

          <EditProductModal
            product={selectedProduct}
            onEdit={handleEditSuccess} 
            isModalOpen={modalState.edit}
            setIsModalOpen={() => closeModal('edit')}            
          />

          <DeleteProductModal
            product={selectedProduct}
            isModalOpen={modalState.delete}
            onDelete={handleDeleteSuccess} 
            setIsModalOpen={() => closeModal('delete')}
          />
        </>
      )}
    </motion.div>
  );
};

export default ProductTable;
