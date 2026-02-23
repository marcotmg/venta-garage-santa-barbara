import { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Buffet - Centro de Entretenimiento',
    description: 'Mueble buffet de diseño escandinavo con cuatro puertas y dos cajones centrales.',
    fullDescription: 'Mueble buffet de diseño escandinavo con cuatro puertas y dos cajones centrales. Madera sólida. Superficie en color nogal y blanco mate. Ideal como buffet de comedor o como centro de entretenimiento para salas y recibidores',
    price: 900000,
    mainImage: '/images/product-01-main.jpg',
    gallery: ['/images/product-01-main-1.jpg', '/images/product-01-main-2.jpg', '/images/product-01-main-3.jpg', '/images/product-01-main-4.jpg', '/images/product-01-main-5.jpg', '/images/product-01-main-6.jpg', '/images/product-01-main-7.jpg']
  },
  {
    id: '2',
    name: 'Comedor a medida 8 puestos (Mesa + 8 sillas)',
    description: 'Espectacular comedor familiar elaborado a medida con acabado de mármol y 8 sillas tapizadas.',
    fullDescription: 'Espectacular comedor familiar, elaborado a medida: mesa cuadrada de 160 cm x lado; fabricado en madera maciza con acabado de mármol. Incluye 8 sillas tapizadas en tela gris basalto neutro, con respaldo alto. Diseño exclusivo que combina elegancia y calidez para reuniones familiares o cenas de negocio.',
    price: 2800000,
    mainImage: '/images/product-02-main.jpg',
    gallery: ['/images/product-02-main-1.jpg', '/images/product-02-main-2.jpg', '/images/product-02-main-3.jpg', '/images/product-02-main-4.jpg', '/images/product-02-main-5.jpg', '/images/product-02-main-6.jpg']
  },
  {
    id: '3',
    name: 'Mesa redonda de antigüedad (Ø110 cm)',
    description: 'Pieza fina de ebanistería elaborada artesanalmente en madera sólida.',
    fullDescription: 'Mesa redonda estilo antiguo, elaborada artesanalmente en madera sólida. Diámetro de 110 cm. Detalles de ebanistería fina en las patas y bordes. Acabado sellado con laca natural que resalta las vetas de la madera. Ideal para estancias y recibidores clásicos o rústicos. Pieza excepcional.',
    price: 1900000,
    mainImage: '/images/product-03-main.jpg',
    gallery: ['/images/product-03-main-1.jpg', '/images/product-03-main-2.jpg', '/images/product-03-main-3.jpg']
  },
  {
    id: '4',
    name: 'Mesa Esquinera Grande (120 x 60)',
    description: 'Mesa rectangular estilo minimalista. 120 cm de largo, 60 cm de ancho y 40 cm de altura.',
    fullDescription: 'Mesa rectangular estilo minimalista, con detalles de bordes redondeados en patas de madera, color maple. 120 cm de largo, 60 cm de ancho y 40 cm de altura.',
    price: 300000,
    mainImage: '/images/product-04-main.jpg',
    gallery: ['/images/product-04-main-1.jpg', '/images/product-04-main-2.jpg', '/images/product-04-main-3.jpg', '/images/product-04-main-4.jpg', '/images/product-04-main-5.jpg']
  },
  {
    id: '5',
    name: 'Mesa Esquinera Mediana (90 x 70)',
    description: 'Mesa rectangular estilo minimalista. 90 cm de largo, 70 cm de ancho y 32 cm de altura.',
    fullDescription: 'Mesa rectangular estilo minimalista, con detalles de bordes redondeados en patas de madera, color maple. 90 cm de largo, 70 cm de ancho y 32 cm de altura.',
    price: 200000,
    mainImage: '/images/product-05-main.jpg',
    gallery: ['/images/product-05-main-1.jpg', '/images/product-05-main-2.jpg', '/images/product-05-main-3.jpg', '/images/product-05-main-4.jpg']
  }
];
