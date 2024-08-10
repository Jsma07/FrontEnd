import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import NavbarClient from './Navbarclient';



const VistaInicial = () => {
              // Hook para manejar la visibilidad de los elementos en la vista
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [summerCollectionRef, summerCollectionInView] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [product1Ref, product1InView] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [product2Ref, product2InView] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [product3Ref, product3InView] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [product4Ref, product4InView] = useInView({ triggerOnce: false, threshold: 0.2 });
  

  return (
    <div>
      <NavbarClient />

      <header id="header-hero">
     <motion.div 
  ref={headerRef}
  initial={{ opacity: 0, y: -50, scale: 0.9 }}
  animate={headerInView ? { opacity: 1, y: 0, scale: 1 } : {}}
  transition={{ duration: 0.8, type: 'spring', stiffness: 300 }}
>
          <div className="header-bg">
            <img 
              src="https://muchosnegociosrentables.com/wp-content/uploads/2017/10/manicura-haciendo-arreglo-de-manos-2.jpg" 
              alt="header-image" 
            />
                </div> 
          <div className="header-content">
            <h2><span className="bienvenidos-style">BIENVENIDOS A UN MUNDO LLENO DE ESTILO.</span></h2>
            <br />
            <p className="description">
              Servicios de manicure con estilos únicos y modernos, diseñados para resaltar tu belleza y personalidad.
            </p>
            <br></br>
            <button className="button" type="button">
              <p><i className="bx bxs-right-arrow-circle"></i> Ver servicios</p>
            </button>
          </div>
        </motion.div>
      </header>

      <section id="summer-collection">
  <motion.div
    ref={summerCollectionRef} // Referencia para detectar el scroll
    className="container"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={summerCollectionInView ? { opacity: 1, scale: 1 } : {}} // Anima solo cuando es visible
    transition={{ duration: 0.8 }}
  >
    <div className="sc-content">
      <h1>Elegancia en Cada Uña</h1>
      <p className="description">
              Ofrecemos una amplia gama de tratamientos, desde manicuras clásicas hasta las últimas tendencias en nail art, utilizando productos de alta calidad para garantizar que tus uñas luzcan impecables y saludables.
              En Jake Nails encontrarás servicios personalizados que se adaptan a tus gustos y necesidades, proporcionando una experiencia de manicure que embellece tus manos y te permite relajarte.
        </p>
    </div>
    <motion.div 
      className="sc-media" 
      whileHover={{ scale: 1.05 }} // Escala la imagen al pasar el cursor
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="sc-media-bg">
        <img 
          src="https://cuponassets.cuponatic-latam.com/backendPe/uploads/imagenes_descuentos/106889/4cb1e2bb9c7a6c4aac8a04eb61bcd5398cc5a2c4.XL2.jpg" 
          alt="sc-image" 
        />
      </div>
    </motion.div>
  </motion.div>
</section>

      <section id="features">
        <div className="container">
          <div className="feature">
            <i className="bx bxs-star"></i>
            <h3>Calidad Premium</h3>
            <p>Ofrecemos los mejores productos para tus uñas, garantizando un acabado impecable y duradero. 
                Nuestra selección está diseñada para brindar resultados profesionales y una experiencia de manicure inigualable.</p>
          </div>
          <div className="feature">
            <i className="bx bxs-like"></i>
            <h3>Clientes Satisfechos</h3>
            <p> La satisfacción de nuestros clientes es lo más importante para nosotros. Nos esforzamos
             por entender sus necesidades y ofrecer un servicio personalizado que garantice una experiencia excelente y resultados
              que superen sus expectativas.</p>
          </div>
          <div className="feature">
            <i className="bx bxs-bulb"></i>
            <h3>Innovación y Tendencias</h3>
            <p>Nos actualizamos constantemente con las técnicas y tendencias más recientes en manicure. Ofrecemos servicios innovadores
               para que tu manicure sea moderno y esté al día con las últimas modas en belleza.</p>
          </div>
        </div>
      </section>

      <section id="products">
        <div className="container">
          <div className="products-header">
            <h2>Tecnicas de uñas mas populares</h2>
            <p>Estas son las tecnicas mas populares de nuestro negocio.</p>
          </div>
          <div className="product product-1">
            <motion.figure
              ref={product1Ref} // Referencia para detectar el scroll
              initial={{ opacity: 0, y: 20 }}
              animate={product1InView ? { opacity: 1, y: 0 } : {}} // Anima solo cuando es visible
              transition={{ duration: 0.6 }}
            >
              <img 
                src="https://i.pinimg.com/736x/aa/6b/6c/aa6b6c50b738427eef8b1328149175c1.jpg" 
                alt="product-image" 
              />
              <figcaption>Uñas Acrilicas</figcaption>
              <figcaption>$ 56.000</figcaption>
            </motion.figure>
          </div>
          <div className="product product-2">
            <motion.figure
              ref={product2Ref} // Referencia para detectar el scroll
              initial={{ opacity: 0, y: 20 }}
              animate={product2InView ? { opacity: 1, y: 0 } : {}} // Anima solo cuando es visible
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img 
                src="https://www.tiendasemilac.com/modules/ph_simpleblog/covers/16.jpg" 
                alt="product-image" 
              />
              <figcaption>Uñas Semipermanentes</figcaption>
              <figcaption>$ 84.000</figcaption>
            </motion.figure>
          </div>
          <div className="product product-3">
            <motion.figure
              ref={product3Ref} // Referencia para detectar el scroll
              initial={{ opacity: 0, y: 20 }}
              animate={product3InView ? { opacity: 1, y: 0 } : {}} // Anima solo cuando es visible
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <img 
                src="https://www.diariodepuertomontt.cl/files/64377718de625.png" 
                alt="product-image" 
              />
              <figcaption>Uñas Press On</figcaption>
              <figcaption>$ 48.000</figcaption>
            </motion.figure>
          </div>
          <div className="product product-4">
            <motion.figure
              ref={product4Ref} // Referencia para detectar el scroll
              initial={{ opacity: 0, y: 20 }}
              animate={product4InView ? { opacity: 1, y: 0 } : {}} // Anima solo cuando es visible
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <img 
                src="https://i.pinimg.com/564x/a6/3a/9f/a63a9f083db8a508683b1ee2700cafec.jpg" 
                alt="product-image" 
              />
              <figcaption>Uñas Poly Gel</figcaption>
              <figcaption>$ 89.000</figcaption>
            </motion.figure>
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="container">
          <h4>Contactanos</h4>
          <p>Santo Domingo Savio, Medellin</p>
          <p>+ (57) 300 564 85 34</p>
          <p>info.jakenails@gmail.com</p>
        </div>
      </section>

      <footer>
        <p className="copy-right">
          <img 
            src="https://res.cloudinary.com/de8cuyd0n/image/upload/v1520412543/E-commerce%20landing%20page/icons/copy-right-img_1x.png" 
            alt="copy right image" 
          /> 
          2017 all rights reserved 
        </p>
        <p>Privacy Policy</p>
        <p>License</p>
      </footer>

      <div className="back-to-top">
        <a href="#nav">
          <img 
            title="Back to Top." 
            src="https://res.cloudinary.com/de8cuyd0n/image/upload/v1520412541/E-commerce%20landing%20page/icons/back_-_top_1x.png" 
            alt="back to top" 
          />
        </a>
      </div>
    </div>
  );
};

export default VistaInicial;
