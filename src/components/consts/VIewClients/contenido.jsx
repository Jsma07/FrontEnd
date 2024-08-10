import React from "react";
import NavbarClient from "./Navbarclient";

function Contenidoitems() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <NavbarClient />

      <main className="container mx-auto px-4 py-8">
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Revive tus Zapatillas Nuestro Limpiador
          </h2>
          <p className="text-gray-600 mb-6">
            Esencial para mantener tus zapatillas siempre como nuevas.
          </p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Comprar
          </button>
        </section>

        {/* Producto Principal */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <img
              src="https://images.unsplash.com/photo-1524995997944-22e2f222e063?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" // Imagen del limpiador de zapatos
              alt="Limpiador de Zapatillas"
              className="w-full h-64 object-contain rounded-md mb-4"
            />
            <h3 className="text-xl font-bold mb-2">Limpiador de Zapatillas</h3>
            <p className="text-gray-600 mb-4">
              Nuestro limpiador especial para devolver a tus zapatillas el
              brillo original.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <img
              src="https://images.unsplash.com/photo-1554980565-55962871f402?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" // Imagen de un par de zapatos limpios
              alt="Zapatillas Limpias"
              className="w-full h-64 object-contain rounded-md mb-4"
            />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Producto 1 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <img
              src="https://picsum.photos/id/1015/200/200"
              alt="Polera Slim Fit"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-bold mb-2">Polera Slim Fit</h3>
            <p className="text-gray-600 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <span className="text-lg font-bold">$8.990</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Contenidoitems;
