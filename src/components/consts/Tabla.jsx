import React, { useState } from "react";
import { Pagination, Box } from "@mui/material";

const TablePrueba = ({ title, columns, data, roles }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5); // Número de filas por página

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRoleFilterChange = (event) => {
    setSelectedRole(event.target.value);
  };

  // Filtrar datos basado en el término de búsqueda y rol seleccionado
  const filteredData = data.filter((row) => {
    if (
      row.rolId &&
      selectedRole !== "" &&
      row.rolId !== parseInt(selectedRole)
    ) {
      return false;
    }
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Paginación
  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Verificar si roles está definido
  if (!roles) {
    roles = [];
  }

  return (
    <section>
      <div
        className="p-2 mx-auto mt-6 max-w-screen-xl"
        style={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}
      >
        <div
          style={{
            paddingTop: "5px",
            margin: "0 auto",
            borderRadius: "40px",
            marginTop: "20px",
            boxShadow: "0 4px 12px rgba(128, 0, 128, 0.15)",
            position: "fixed",
            left: "90px",
            top: "80px",
            width: "calc(100% - 100px)",
          }}
        >
          <div className="bg-white rounded-lg shadow-md p-8 ">
            <div className="flex justify-between items-center mb-4">
              <h4
                style={{
                  textAlign: "left",
                  fontSize: "23px",
                  fontWeight: "bold",
                }}
                className="text-3xl"
              >
                {title}
              </h4>

              <div className="relative w-80">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Buscar"
                />
              </div>

              {roles.length > 0 && (
                <div className="relative w-80">
                  <select
                    value={selectedRole}
                    onChange={handleRoleFilterChange}
                    className="block w-full p-4 pl-3 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Filtrar por rol</option>
                    {roles.map((role) => (
                      <option key={role.idRol} value={role.idRol}>
                        {role.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="relative overflow-hidden bg-white shadow-md sm:rounded-lg">
              <div className="w-full overflow-x-auto">
                <table className="w-full table-auto text-sm text-center text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column.field}
                          className="px-6 py-3 text-center"
                        >
                          {column.headerName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b hover:bg-gray-100">
                        {columns.map((column, colIndex) => (
                          <td
                            key={colIndex}
                            className="px-6 py-3 text-center whitespace-nowrap"
                          >
                            {column.field === "rolId"
                              ? roles.find(
                                  (role) => role.idRol === row[column.field]
                                )?.nombre || "Desconocido"
                              : column.renderCell
                              ? column.renderCell({ row })
                              : row[column.field]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={Math.ceil(filteredData.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
              />
            </Box>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TablePrueba;
