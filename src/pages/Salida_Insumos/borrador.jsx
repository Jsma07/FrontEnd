<table className="min-w-full bg-white">
<thead>
  <tr>
    <th className="px-4 py-2 border-b border-gray-200">Imagen</th>
    <th className="px-4 py-2 border-b border-gray-200">Nombre</th>
    <th className="px-4 py-2 border-b border-gray-200">Cantidad</th>
    <th className="px-4 py-2 border-b border-gray-200">Categoría</th>
  </tr>
</thead>
<tbody>
  {insumosSeleccionados.map((insumo) => (
    <tr key={insumo.IdInsumos}>
      <td className="px-4 py-2 border-b border-gray-200">
        <img
          src={`http://localhost:5000${insumo.Imagen}`}
          alt={insumo.NombreInsumos}
          className="w-20 h-20 object-cover"
        />
      </td>
      <td className="px-4 py-2 border-b border-gray-200">
        {insumo.NombreInsumos}
      </td>
      <td className="px-4 py-2 border-b border-gray-200">
        {insumo.Cantidad}
      </td>
      <td className="px-4 py-2 border-b border-gray-200">
        {insumo.nombre_categoria}
      </td>
    </tr>
  ))}


<div style={{ textAlign: "right", marginBottom: "20px" }}>
          <p>
            <i className="bx bx-cart-download"></i>{" "}
            <span className="text-lg font-bold">{insumosAgregadosCount}</span>
          </p>
        </div>
</tbody>
</table>

