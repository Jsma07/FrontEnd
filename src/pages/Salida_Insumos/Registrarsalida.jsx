import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";

const SalidaInsumos = () => {
  const [insumos, setInsumos] = useState([]);

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
      <div className="p-2 mx-auto mt-6 max-w-screen-xl">
  <div className="flex items-center justify-between mb-6">
    <Typography
      variant="h3"
      color="blue-gray"
      className="font-bold text-left"
    >
      Salida de Insumos
    </Typography>
    <i className='bx bx-cart-add text-xl cursor-pointer'></i>
  </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {insumos.map((insumo) => (
            <Card
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

                <Typography
                  variant="small"
                  color="gray"
                  className="font-normal opacity-75 text-xs"
                ></Typography>
                <Typography color="gray" className="mb-2"></Typography>

                <div className="group mt-4 inline-flex flex-wrap items-center gap-2"></div>
                <CardFooter className="pt-0 flex justify-center">
                  {insumo.Estado !== "agotado" && (
                    <Button
                      style={{
                        boxShadow: "0 4px 3px rgba(0, 0, 0, 0.2)",
                        backgroundColor: "#EF5A6F", // Color de fondo rosado
                        color: "#fff", // Color del texto blanco
                        textTransform: "none", // Desactiva la transformación de texto
                        fontSize: "1rem", // Tamaño del texto
                      }}
                      className="hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100 flex items-center gap-2"
                    >
                      <i
                        className="bx bx-trash"
                        style={{ fontSize: "1.5rem" }}
                      ></i>{" "}
                      {/* Tamaño del ícono ajustado */}
                      Sacar insumo
                    </Button>
                  )}
                </CardFooter>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalidaInsumos;
