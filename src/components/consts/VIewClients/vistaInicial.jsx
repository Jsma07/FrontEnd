import React, { useEffect } from 'react';
import NavbarClient from "./Navbarclient";


const VistaInicial = () => {
  useEffect(() => {
    console.log('VistaInicial se ha montado');
  }, []);
  return (
    <div>
      <NavbarClient />

      <header>
        <div id="header-hero">
          <div className="header-bg">
            <img 
              src="https://muchosnegociosrentables.com/wp-content/uploads/2017/10/manicura-haciendo-arreglo-de-manos-2.jpg" 
              alt="header-image" 
            />
          </div>
          <div className="header-content">
            <h2><span className="bienvenidos-style">BIENVENIDOS A UN MUNDO LLENO DE ESTILO.</span></h2>
            <br></br>
            <p className="description">
              Servicios de manicure con estilos únicos y modernos, diseñados para resaltar tu belleza y personalidad.
            </p>
            <button className="button" type="button">
              <p><i className="bx bxs-right-arrow-circle"></i> Ver servicios</p>
            </button>
          </div>
        </div>
      </header>

      <section id="summer-collection">
        <div className="container">
          <div className="sc-content">
            <h1>Elegancia en Cada Uña</h1>
            <p className="description">
              Ofrecemos una amplia gama de tratamientos, desde manicuras clásicas hasta las últimas tendencias en nail art, utilizando productos de alta calidad para garantizar que tus uñas luzcan impecables y saludables.
              En Jake Nails encontrarás servicios personalizados que se adaptan a tus gustos y necesidades, proporcionando una experiencia de manicure que embellece tus manos y te permite relajarte.
            </p>
          </div>
          <div className="sc-media">
            <div className="sc-media-bg">
              <img 
                src="https://cuponassets.cuponatic-latam.com/backendPe/uploads/imagenes_descuentos/106889/4cb1e2bb9c7a6c4aac8a04eb61bcd5398cc5a2c4.XL2.jpg" 
                alt="sc-image" 
              />
            </div>
          </div>
        </div>
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
            <h2>Tecnicas de uñas mas populares </h2>
            <p>Estas son las tecnicas mas populares de nuestro negocio.</p>
          </div>
          <div className="product product-1">
            <figure>
              <img 
                src="https://i.pinimg.com/736x/aa/6b/6c/aa6b6c50b738427eef8b1328149175c1.jpg" 
                alt="product-image" 
              />
              <figcaption>Uñas Acrilicas</figcaption>
              <figcaption>$ 56.000</figcaption>
            </figure>
          </div>
          <div className="product product-2">
            <figure>
              <img 
                src="https://www.tiendasemilac.com/modules/ph_simpleblog/covers/16.jpg" 
                alt="product-image" 
              />
              <figcaption>Uñas Semipermanentes</figcaption>
              <figcaption>$ 84.000</figcaption>
            </figure>
          </div>
          <div className="product product-3">
            <figure>
              <img 
                src="https://www.diariodepuertomontt.cl/files/64377718de625.png" 
                alt="product-image" 
              />
              <figcaption>Uñas Press On</figcaption>
              <figcaption>$ 48.000</figcaption>
            </figure>
          </div>
          <div className="product product-4">
            <figure>
              <img 
                src="https://i.pinimg.com/564x/a6/3a/9f/a63a9f083db8a508683b1ee2700cafec.jpg" 
                alt="product-image" 
              />
              <figcaption>Uñas Poly Gel</figcaption>
              <figcaption>$ 89.000</figcaption>
            </figure>
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
