import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  Typography,
  IconButton,
  Button,
  Input,
} from "@material-tailwind/react";
import ModalInsumos from "../../components/consts/ModalSalida";

const SalidaInsumos = () => {
  const [insumos, setInsumos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/insumos");
        setInsumos(response.data);
      } catch (error) {
        console.error("Error al obtener los insumos:", error);
      }
    };

    fetchInsumos();
  }, []);

  const handleAgregarInsumo = (insumo) => {
    const insumoExistente = carrito.find(
      (item) => item.IdInsumos === insumo.IdInsumos
    );
    if (insumoExistente) {
      const nuevoCarrito = carrito.map((item) =>
        item.IdInsumos === insumo.IdInsumos
          ? {
              ...item,
              cantidad: item.cantidad + 1,
              total: (item.cantidad + 1) * item.PrecioUnitario,
            }
          : item
      );
      setCarrito(nuevoCarrito);
    } else {
      setCarrito([
        ...carrito,
        { ...insumo, cantidad: 1, total: insumo.PrecioUnitario },
      ]);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const totalInsumos = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const filteredInsumos = insumos
    .filter((insumo) =>
      insumo.NombreInsumos.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((insumo) =>
      selectedCategory ? insumo.nombre_categoria === selectedCategory : true
    );

  const categorias = [
    ...new Set(insumos.map((insumo) => insumo.nombre_categoria)),
  ];

  return (
    <div
      style={{
        paddingTop: "7px",
        margin: "0 auto",
        borderRadius: "30px",
        marginTop: "20px",
        position: "fixed",
        right: "20px",
        top: "30px",
        width: "calc(100% - 100px)",
        padding: "10px",
      }}
    >
      <div
        className="p-2 mx-auto mt-6 max-w-screen-xl"
        style={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between mb-6">
          <Typography
            variant="h3"
            color="blue-gray"
            className="font-bold text-left"
          >
            Salida de Insumos
          </Typography>
          <div className="relative">
            <IconButton
              onClick={() => setModalOpen(true)}
              className="text-xl"
              style={{
                backgroundColor: "white",
                borderRadius: "50%",
                padding: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <i className="bx bx-cart"></i>
              {totalInsumos > 0 && (
                <span
                  className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-500 rounded-full"
                  style={{ transform: "translate(50%, -50%)" }}
                >
                  {totalInsumos}
                </span>
              )}
            </IconButton>
          </div>
        </div>

        <div className="flex items-center mb-6   relative ml-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                />
              </svg>
            </div>
            <input
              type="text"
              label="Buscar insumo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Buscar insumo..."
              required
            />
          </div>

          <div className="relative ml-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInsumos.map((insumo) => (
            <Card
              key={insumo.IdInsumos}
              className="w-80"
              style={{
                boxShadow: "0 4px 3px rgba(0, 0, 0, 0.4)",
                borderTop: "1px solid rgba(0, 0, 0, 0.2)",
                borderRadius: "30px",
              }}
            >
              <CardHeader shadow={false} floated={false} className="h-60">
                <img
                  src={`http://localhost:5000${insumo.imagen}`}
                  alt={insumo.NombreInsumos}
                  className="h-full w-full object-cover"
                />
              </CardHeader>
              <CardBody className="p-2">
                <div className="mb-1 flex items-center justify-between">
                  <Typography
                    color="blue-gray"
                    className="font-semibold text-lg"
                  >
                    {insumo.NombreInsumos}
                  </Typography>
                  <Typography color="blue-gray" className="font-medium text-sm">
                    ${insumo.PrecioUnitario.toFixed(2)}
                  </Typography>
                </div>
                <Typography
                  color="blue-gray"
                  className="font-medium text-md mt-1"
                >
                  Cantidad en stock: {insumo.Cantidad}
                </Typography>
                <div className="group mt-4 inline-flex flex-wrap items-center gap-2"></div>
                <CardFooter className="pt-0 flex justify-center">
                  {insumo.Estado !== "agotado" && (
                    <Button
                      style={{
                        boxShadow: "0 4px 3px rgba(0, 0, 0, 0.2)",
                        backgroundColor: "#EF5A6F",
                        color: "#fff",
                        textTransform: "none",
                        fontSize: "1rem",
                      }}
                      className="hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100 flex items-center gap-2"
                      onClick={() => handleAgregarInsumo(insumo)}
                    >
                      <i
                        className="bx bx-plus"
                        style={{ fontSize: "1.5rem" }}
                      ></i>
                      Sacar insumo
                    </Button>
                  )}
                </CardFooter>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <ModalInsumos
        open={modalOpen}
        handleClose={handleCloseModal}
        title="Carrito de Insumos"
        carrito={carrito}
        actualizarCarrito={setCarrito}
      />
    </div>
  );
};

export default SalidaInsumos;
