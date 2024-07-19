import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../../components/consts/Tabla";
import ModalAgregarInsumo from "../../components/consts/modal";
import ModalEditarInsumo from "../../components/consts/modalEditar";
import CamposObligatorios from "../../components/consts/camposVacios";
import Fab from "@mui/material/Fab";

const Insumos = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [insumos, setInsumos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);
  const [buscar, setBuscar] = useState("");

  useEffect(() => {
    fetchInsumos();
    fetchCategorias();
  }, []);

  const fetchInsumos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/insumos");
      console.log("Insumos fetched:", response.data); // Agrega este log para verificar la estructura
      setInsumos(response.data);
    } catch (error) {
      console.error("Error fetching insumos:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categorias");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  const filtrar = insumos.filter((insumo) => {
    const {
      NombreInsumos,
      Cantidad,
      UsosDisponibles,
      PrecioUnitario,
      IdCategoria,
      IdInsumos,
      Estado,
    } = insumo;
    const terminoABuscar = buscar.toLowerCase();

    const IdInsumoString = IdInsumos?.toString() || "";
    const PrecioUnitarioString = PrecioUnitario?.toString() || "";
    const CantidadString = Cantidad?.toString() || "";
    const UsosDisponiblesString = UsosDisponibles?.toString() || "";
    const IdCategoriaString = IdCategoria?.toString() || "";

    const categoria = categorias.find((c) => c.IdCategoria === IdCategoria);
    const nombreCategoria = categoria
      ? categoria.nombre_categoria.toLowerCase()
      : "";

    return (
      NombreInsumos.toLowerCase().includes(terminoABuscar) ||
      Estado.toLowerCase().includes(terminoABuscar) ||
      PrecioUnitarioString.includes(terminoABuscar) ||
      CantidadString.includes(terminoABuscar) ||
      UsosDisponiblesString.includes(terminoABuscar) ||
      nombreCategoria.includes(terminoABuscar) ||
      IdInsumoString.includes(terminoABuscar)
    );
  });

  const handleAddInsumo = async (formData) => {
    try {
      const {
        NombreInsumos,
        Cantidad,
        usos_unitarios,
        PrecioUnitario,
        IdCategoria,
        Imagen,
      } = formData; // Asegúrate de incluir usos_unitarios y PrecioUnitario

      const camposObligatorios = [
        "NombreInsumos",
        "Imagen",
        "Cantidad",
        "usos_unitarios",
        "PrecioUnitario",
        "IdCategoria",
      ]; // Añadir usos_unitarios y PrecioUnitario

      if (
        !CamposObligatorios(
          formData,
          camposObligatorios,
          "Por favor, complete todos los campos del proveedor."
        )
      ) {
        return;
      }

      if (!/^[a-zA-Z0-9\s]+$/.test(NombreInsumos)) {
        window.Swal.fire({
          icon: "error",
          title: "Nombre del insumo inválido",
          text: "El nombre del insumo no debe contener caracteres especiales.",
        });
        return;
      }

      const parsedCantidad = parseInt(Cantidad);
      const parsedUsosUnitarios = parseInt(usos_unitarios); // Añadir la conversión de usos_unitarios
      const parsedPrecioUnitario = parseFloat(PrecioUnitario); // Añadir la conversión de PrecioUnitario

      const confirmation = await window.Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres agregar este insumo?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, agregar",
        cancelButtonText: "Cancelar",
      });

      if (confirmation.isConfirmed) {
        const formDataToSend = new FormData();
        formDataToSend.append("NombreInsumos", NombreInsumos);
        formDataToSend.append("Cantidad", parsedCantidad);
        formDataToSend.append("usos_unitarios", parsedUsosUnitarios); // Añadir usos_unitarios al FormData
        formDataToSend.append("PrecioUnitario", parsedPrecioUnitario); // Añadir PrecioUnitario al FormData
        formDataToSend.append("IdCategoria", IdCategoria);
        formDataToSend.append("Imagen", Imagen);

        await axios.post(
          "http://localhost:5000/api/insumos/guardarInsumo",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        handleCloseModalAgregar();
        fetchInsumos();
        window.Swal.fire("Insumo agregado!", "", "success");
      }
    } catch (error) {
      console.error("Error al agregar insumo:", error);
    }
  };

  const handleEditInsumo = async (formData) => {
    try {
      const insumoExistente = insumos.find(
        (insumo) =>
          insumo.NombreInsumos === formData.NombreInsumos &&
          insumo.IdInsumos !== formData.IdInsumos
      );
  
      const camposObligatorios = [
        "NombreInsumos",
        "Imagen",
        "PrecioUnitario",
        "Estado",
        "IdCategoria",
      ];
  
      if (
        !CamposObligatorios(
          formData,
          camposObligatorios,
          "Por favor, complete todos los campos del insumo."
        )
      ) {
        return;
      }
  
      if (insumoExistente) {
        window.Swal.fire({
          icon: "warning",
          title: "Insumo ya registrado",
          text: "El insumo ingresado ya está registrado.",
        });
        return;
      }
  
      const NombreInsumos = formData["NombreInsumos"];
      if (!/^[a-zA-Z0-9\s]+$/.test(NombreInsumos)) {
        window.Swal.fire({
          icon: "error",
          title: "Nombre del insumo inválido",
          text: "El nombre del insumo no debe contener caracteres especiales.",
        });
        return;
      }
  
      const confirmation = await window.Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres actualizar este insumo?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, actualizar",
        cancelButtonText: "Cancelar",
      });
  
      if (confirmation.isConfirmed) {
        // Preparar datos para enviar
        const formDataWithNumbers = new FormData();
        formDataWithNumbers.append("NombreInsumos", formData.NombreInsumos);
        formDataWithNumbers.append("Imagen", formData.Imagen); // Esto se actualizará si el usuario sube una nueva imagen
        formDataWithNumbers.append("PrecioUnitario", formData.PrecioUnitario);
        formDataWithNumbers.append("Estado", formData.Estado);
        formDataWithNumbers.append("IdCategoria", formData.IdCategoria);
  
        const response = await axios.put(
          `http://localhost:5000/api/insumos/editar/${formData.IdInsumos}`,
          formDataWithNumbers,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        handleCloseModalEditar();
        fetchInsumos(); // Recargar la lista de insumos después de la actualización
        window.Swal.fire("¡Insumo actualizado!", "", "success");
      }
    } catch (error) {
      console.error("Error al editar insumo:", error);
      window.Swal.fire("Error", "Hubo un error al intentar actualizar el insumo", "error");
    }
  };
  
  const handleChange = (name, value) => {
    setInsumoSeleccionado((prevInsumo) => ({
      ...prevInsumo,
      [name]: value,
    }));
  };

  const handleCloseModalAgregar = () => {
    setOpenModalAgregar(false);
    setInsumoSeleccionado(null);
  };

  const handleCloseModalEditar = () => {
    setOpenModalEditar(false);
    setInsumoSeleccionado(null);
  };

  const handleEditClick = (insumo) => {
    setInsumoSeleccionado(insumo);
    setOpenModalEditar(true);
  };

  return (
    <div className="container mx-auto p-4 relative">

      <ModalAgregarInsumo
        open={openModalAgregar}
        handleClose={handleCloseModalAgregar}
        onSubmit={handleAddInsumo}
        title="Crear Nuevo Insumo"
        fields={[
          { name: "NombreInsumos", label: "Nombre insumo", type: "text" },
          { name: "Cantidad", label: "Cantidad", type: "number" },
          { name: "PrecioUnitario", label: "Precio Unitario", type: "number" },
          { name: "usos_unitarios", label: "Usos Unitarios", type: "number" },
          {
            name: "IdCategoria",
            label: "Categoria insumo",
            type: "select",
            options: categorias
              .filter((categoria) => categoria.estado_categoria === 1)
              .map((categoria) => ({
                value: categoria.IdCategoria,
                label: categoria.nombre_categoria,
              })),
          },
          { name: "Imagen", label: "Imagen", type: "file" },
        ]}
        onChange={handleChange}
      />
      <ModalEditarInsumo
        open={openModalEditar}
        handleClose={handleCloseModalEditar}
        onSubmit={handleEditInsumo}
        title="Editar Insumo"
        fields={[
          {
            name: "IdInsumos",
            label: "Identificador",
            type: "text",
            readOnly: true,
          },
          { name: "NombreInsumos", label: "Nombre insumo", type: "text" },
          {
            name: "IdCategoria",
            label: "Categoria insumo",
            type: "select",
            options: categorias
              .filter((categoria) => categoria.estado_categoria === 1)
              .map((categoria) => ({
                value: categoria.IdCategoria,
                label: categoria.nombre_categoria,
              })),
          },
          { name: "PrecioUnitario", label: "Precio Unitario", type: "number" },
          { name: "Imagen", label: "Imagen", type: "file" },
        ]}
        onChange={handleChange}
        entityData={insumoSeleccionado}
      />

      <Table
        columns={[
          { field: "nombre_categoria", headerName: "CATEGORIA", width: "w-36" },
          {
            field: "Imagen",
            headerName: "IMAGEN",
            width: "w-32",
            renderCell: (params) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <div>
                {insumos.map((insumo) => (
                  <div key={insumo.IdInsumos}>
                    {console.log(`http://localhost:5000${insumo.imagen}`)}
                    <img
                      src={`http://localhost:5000${insumo.imagen}`}  
                      alt="Imagen" style={{ maxWidth: "100%", height: "auto", width: "3rem", height: "3rem", borderRadius: "50%" }}
                    />
                  </div>
                ))}
                </div>
              </div>
            ),
          },
          {
            field: "NombreInsumos",
            headerName: "NOMBRE INSUMO",
            width: "w-36",
          },
          { field: "Cantidad", headerName: "CANTIDAD", width: "w-36" },
          {
            field: "usos_unitarios",
            headerName: "USOS UNITARIOS",
            width: "w-36",
          },
          {
            field: "UsosDisponibles",
            headerName: "USOS DISPONIBLES",
            width: "w-36",
          },
          {
            field: "PrecioUnitario",
            headerName: "PRECIO UNITARIO",
            width: "w-36",
          },
          {
            field: "Estado",
            headerName: "ESTADO",
            width: "w-36",
            readOnly: true,
            renderCell: (params) => (
              <div>
                {params.row.Estado === "Terminado" && (
                  <span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                    Terminado
                  </span>
                )}
                {params.row.Estado === "Disponible" && (
                  <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                    Disponible
                  </span>
                )}
              </div>
            )
          },
          {
            field: "Acciones",
            headerName: "ACCIONES",
            width: "w-48",
            renderCell: (params) => (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleEditClick(params.row)}
                  className="text-yellow-500"
                >
                  <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>
                </button>
              </div>
            ),
          },
        ]}
        data={filtrar}
        title={'Gestion de insumos'}

      />
      <Fab
        aria-label="add"
        style={{
          border: "0.5px solid grey",
          backgroundColor: "#94CEF2",
          position: "fixed",
          bottom: "16px",
          right: "16px",
          zIndex: 1000,
        }}
        onClick={() => setOpenModalAgregar(true)}
      >
        <i className="bx bx-plus" style={{ fontSize: "1.3rem" }}></i>
      </Fab>
    </div>
  );
};

export default Insumos;
