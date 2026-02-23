import { products } from '../data';
import { ProductCard } from '../components/ProductCard';
import { GitHubPublish } from '../components/GitHubPublish';
import { motion } from 'motion/react';

export function CatalogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
            Venta de Garage
          </h1>
          <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
            ¡Todo debe irse! Aprovecha nuestra liquidación total por mudanza. Encuentra muebles y artículos de calidad a precios de remate. ¡Ven por lo tuyo antes de que alguien más se lo lleve!
          </p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="mt-24 max-w-md mx-auto">
        <GitHubPublish />
      </div>

      <footer className="mt-20 pt-8 border-t border-zinc-200 text-center text-zinc-400 text-sm">
        <p>&copy; 2026 Venta de Garage Santa Bárbara. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
