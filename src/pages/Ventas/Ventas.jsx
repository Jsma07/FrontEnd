// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Tabla from "../../components/consts/Tabla";
// import Fab from "@mui/material/Fab";
// import DeleteIcon from "@mui/icons-material/Delete";
// import {
//   AlertDialog,
//   AlertDialogBody,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogContent,
//   AlertDialogOverlay,
//   Button,
// // } from "@chakra-ui/react";

// const Ventas = () => {
//   const [ventas, setVentas] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [ventaIdToDelete, setVentaIdToDelete] = useState(null);

//   useEffect(() => {
//     const fetchVentas = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/Jackenail/Listarventas"
//         );
//         const ventasConDetalles = response.data.map((venta) => ({
//           idServicio: (
//             <img
//               src={venta.servicio.ImgServicio}
//               alt={venta.servicio.Nombre_Servicio}
//               className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full"
//             />
//           ),

//           IdCliente: `${venta.cliente.Nombre} ${venta.cliente.Apellido}`,
//           idEmpleado: `${venta.empleado.Nombre} ${venta.empleado.Apellido}`,
//           Fecha: venta.Fecha,
//           Total: venta.Total,
//           Subtotal: venta.Subtotal,
//           Estado: convertirEstado(venta.Estado),
//           Acciones: (
//             <Fab
//               size="small"
//               color="secondary"
//               aria-label="delete"
//               onClick={() => handleOpenAlert(venta.IdVentas)}
//             >
//               <DeleteIcon />
//             </Fab>
//           ),
//         }));
//         setVentas(ventasConDetalles);
//       } catch (error) {
//         console.error("Error al obtener los datos de ventas:", error);
//       }
//     };

//     fetchVentas();
//   }, []);

//   const convertirEstado = (estado) => {
//     switch (estado) {
//       case 1:
//         return "Vendido";
//       case 2:
//         return "En proceso";
//       case 3:
//         return "Anulado";
//       default:
//         return "Desconocido";
//     }
//   };

//   const handleOpenAlert = (ventaId) => {
//     console.log("ID de venta a eliminar:", ventaId);
//     setVentaIdToDelete(ventaId);
//     setIsOpen(true);
//   };

//   const handleEliminarVenta = async () => {
//     try {
//       // Lógica para eliminar la venta utilizando axios.delete o alguna otra función de eliminación
//       // Después de eliminar la venta, podrías volver a cargar las ventas para reflejar los cambios en la tabla
//       console.log("Venta eliminada con éxito:", ventaIdToDelete);
//       setIsOpen(false);
//     } catch (error) {
//       console.error("Error al eliminar la venta:", error);
//     }
//   };

//   const columns = [
//     { field: "idServicio", headerName: "Servicio" },
//     { field: "IdCliente", headerName: "Cliente" },
//     { field: "idEmpleado", headerName: "Empleado" },
//     { field: "Fecha", headerName: "Fecha" },
//     { field: "Total", headerName: "Total" },
//     { field: "Subtotal", headerName: "Subtotal" },
//     { field: "Estado", headerName: "Estado" },
//     { field: "Acciones", headerName: "Acciones" },
//   ];

//   return (
//     <div>
//       <Tabla columns={columns} data={ventas} />

//       <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
//         <AlertDialogOverlay>
//           <AlertDialogContent>
//             <AlertDialogHeader fontSize="lg" fontWeight="bold">
//               Confirmación
//             </AlertDialogHeader>

//             <AlertDialogBody>
//               ¿Estás seguro de que deseas eliminar esta venta?
//             </AlertDialogBody>

//             <AlertDialogFooter>
//               <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
//               <Button colorScheme="red" ml={3} onClick={handleEliminarVenta}>
//                 Eliminar
//               </Button>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialogOverlay>
//       </AlertDialog>

//       <Fab
//         aria-label="add"
//         style={{
//           border: "0.5px solid grey",
//           backgroundColor: "#94CEF2",
//           position: "fixed",
//           bottom: "16px",
//           right: "16px",
//           zIndex: 1000,
//         }}
//       >
//         <i className="bx bx-plus" style={{ fontSize: "1.3rem" }}></i>
//       </Fab>
//     </div>
//   );
// };

// export default Ventas;
