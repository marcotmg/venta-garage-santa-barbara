import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group bg-white border border-zinc-200 rounded-2xl overflow-hidden flex flex-col h-full transition-all hover:shadow-xl hover:border-zinc-300 cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
        <img
          src={product.mainImage}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
          <span className="text-emerald-600 font-bold text-lg">
            {formattedPrice}
          </span>
        </div>
        
        <p className="text-zinc-600 text-sm leading-relaxed flex-grow">
          {product.fullDescription}
        </p>
        
        <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center text-zinc-400 text-xs font-medium uppercase tracking-wider">
          Ver detalles
          <svg 
            className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
