import React, { useState } from "react";
import { Modal, Typography, Grid, Button } from "@mui/material";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Tooltip,
} from "@material-tailwind/react";

const ModalInsumos = ({
  open,
  handleClose,
  title = "",
  insumos,
  setInsumosSeleccionados,
  insumosSeleccionados,
}) => {
  const [insumosAgregados, setInsumosAgregados] = useState([]);

  const handleAdd = (id) => {
    const insumoSeleccionado = insumos.find(
      (insumo) => insumo.IdInsumos === id
    );
    setInsumosSeleccionados([...insumosSeleccionados, insumoSeleccionado]);
    setInsumosAgregados([...insumosAgregados, id]); // Agregar el IdInsumos a la lista de insumos agregados
  };

  // Función para verificar si un insumo ya ha sido agregado
  const isInsumoAgregado = (id) => {
    return insumosAgregados.includes(id);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-[90%] overflow-auto">
        <Typography variant="h5" gutterBottom className="text-center mb-6">
          {title}
        </Typography>
        <Grid container spacing={3}>
          {insumos &&
            insumos.map((insumo) => (
              <Grid item xs={12} sm={6} md={3} key={insumo.IdInsumos}>
                <Card className="w-full max-w-[16rem] shadow-lg">
                  <CardHeader floated={false} color="blue-gray">
                    <img
                      src={`http://localhost:5000${insumo.Imagen}`}
                      alt={insumo.NombreInsumos}
                      className="h-32 object-cover w-full"
                    />
                  </CardHeader>
                  <CardBody>
                    <div className="mb-3">
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className="font-medium"
                      >
                        {insumo.NombreInsumos}
                      </Typography>
                      <Typography color="blue-gray" className="text-sm">
                        <Tooltip
                          content={`Precio unitario: $${insumo.precio_unitario}`}
                        >
                          <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-2 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="h-4 w-4"
                            >
                              <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                              <path
                                fillRule="evenodd"
                                d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
                                clipRule="evenodd"
                              />
                              <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
                            </svg>
                          </span>
                        </Tooltip>
                      </Typography>
                    </div>
                    <Typography color="gray" className="text-xs">
                      Usos disponibles: {insumo.UsosDisponibles}
                    </Typography>
                    <Typography color="gray" className="text-xs">
                      Estado: {insumo.Estado}
                    </Typography>
                    <div className="flex justify-center mt-2">
                      <Button
                        variant="contained"
                        onClick={() => handleAdd(insumo.IdInsumos)}
                        className="w-3/4 text-xs"
                        disabled={isInsumoAgregado(insumo.IdInsumos)}
                      >
                        Agregar
                      </Button>
                    </div>
                  </CardBody>
                  <CardFooter className="pt-2">
                    <Button size="sm" fullWidth={true}>
                      Reservar
                    </Button>
                  </CardFooter>
                </Card>
              </Grid>
            ))}
        </Grid>
        <div className="flex justify-center mt-6">
          <Button
            variant="contained"
            onClick={handleClose}
            className="w-1/2 text-sm"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalInsumos;
