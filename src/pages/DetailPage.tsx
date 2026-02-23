import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data';
import { motion } from 'motion/react';
import { ArrowLeft, Tag, Info } from 'lucide-react';
import { useState } from 'react';

export function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const [activeImage, setActiveImage] = useState(product?.mainImage);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900">Producto no encontrado</h2>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 text-emerald-600 hover:underline"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(product.price);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hola, estoy interesado en el producto: ${product.name}`);
    window.open(`https://wa.me/525522701178?text=${message}`, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <button
        onClick={() => navigate('/')}
        className="mb-8 flex items-center text-zinc-500 hover:text-zinc-900 transition-colors font-medium group"
      >
        <ArrowLeft className="mr-2 w-5 h-5 transition-transform group-hover:-translate-x-1" />
        Volver al catálogo
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Galería de Imágenes */}
        <div className="space-y-4">
          <motion.div 
            layoutId={`image-${product.id}`}
            className="aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm"
          >
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={() => setActiveImage(product.mainImage)}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                activeImage === product.mainImage ? 'border-emerald-500 scale-95' : 'border-transparent hover:border-zinc-300'
              }`}
            >
              <img src={product.mainImage} alt="Main" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </button>
            {product.gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === img ? 'border-emerald-500 scale-95' : 'border-transparent hover:border-zinc-300'
                }`}
              >
                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Información del Producto */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex items-center text-emerald-600 text-sm font-bold uppercase tracking-widest mb-2">
              <Tag className="w-4 h-4 mr-2" />
              Disponible para venta
            </div>
            <h1 className="text-4xl font-bold text-zinc-900 mb-4">{product.name}</h1>
            <div className="text-3xl font-bold text-emerald-600 mb-6">
              {formattedPrice}
            </div>
          </div>

          <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-100 flex-grow">
            <div className="flex items-center text-zinc-900 font-semibold mb-4">
              <Info className="w-5 h-5 mr-2 text-emerald-500" />
              Descripción Detallada
            </div>
            <p className="text-zinc-600 leading-relaxed text-lg italic">
              "{product.description}"
            </p>
            <div className="mt-6 pt-6 border-t border-zinc-200">
              <p className="text-zinc-700 leading-relaxed">
                {product.fullDescription}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button 
              onClick={handleWhatsApp}
              className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200"
            >
              Contactar para comprar
            </button>
            <p className="text-center text-zinc-400 text-xs">
              Ubicación: Santa Bárbara Central, Bogotá.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
