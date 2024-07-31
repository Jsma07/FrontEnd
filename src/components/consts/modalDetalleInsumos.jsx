import React, { useState } from "react";
import { Modal, Typography, Grid, Button } from "@mui/material";
import { Card, CardHeader, CardBody, CardFooter, Tooltip } from "@material-tailwind/react";

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
    const insumoSeleccionado = insumos.find((insumo) => insumo.IdInsumos === id);
    
    if (insumoSeleccionado) {
      const nuevoDetalleCompra = {
        ...insumoSeleccionado,
      };

      setInsumosSeleccionados([...insumosSeleccionados, nuevoDetalleCompra]);
      setInsumosAgregados([...insumosAgregados, id]);
    }
  };

  const isInsumoAgregado = (id) => {
    return insumosAgregados.includes(id);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-[80%] overflow-auto">
        <Typography variant="h5" gutterBottom className="text-center mb-6">
          {title}
        </Typography>
        <Grid container spacing={3}>
          {insumos &&
            insumos.map((insumo) => (
              <Grid item xs={12} sm={6} md={3} key={insumo.IdInsumos}>
                <Card className="w-full max-w-[12rem] shadow-lg">
                  <CardHeader floated={false} color="blue-gray">
                    <img
                      src={`http://localhost:5000${insumo.imagen}`}
                      alt={insumo.NombreInsumos}
                      className="h-20 object-cover w-full"
                    />
                  </CardHeader>
                  <CardBody>
                    <div className="mb-3">
                      <Typography variant="h6" color="blue-gray" className="font-medium text-sm">
                        {insumo.NombreInsumos}
                      </Typography>
                      <Typography color="blue-gray" className="text-xs">
                        <Tooltip content={`Precio unitario: $${insumo.PrecioUnitario}`}>
                          <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-2 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10"></span>
                        </Tooltip>
                      </Typography>
                    </div>
                    <Typography color="gray" className="text-xs">
                      Categoria: {insumo.Idcategoria}
                    </Typography>
                    <Typography color="gray" className="text-xs">
                      Proveedor: {insumo.Idproveedor}
                    </Typography>
                  </CardBody>
                  <CardFooter className="pt-2">
                    <Button
                      variant="contained"
                      onClick={() => handleAdd(insumo.IdInsumos)}
                      className="w-3/4 text-xs"
                      disabled={isInsumoAgregado(insumo.IdInsumos)}
                    >
                      Agregar
                    </Button>
                  </CardFooter>
                </Card>
              </Grid>
            ))}
        </Grid>
        <div className="flex justify-center mt-6">
          <Button variant="contained" onClick={handleClose} className="w-1/2 text-sm">
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalInsumos;
