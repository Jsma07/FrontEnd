import React, { useState, useEffect } from "react";
import axios from 'axios';

const CrearCompra = () => {
    const [selectedRows, setSelectedRows] = useState([]);

    return (
        <div>
            <center><h2 style={{ marginTop: '-170px', fontSize: '24px', fontWeight: 'bold' }}>Registrar Compra</h2></center>
            <br/>
                <div className="flex items-center ">
                    <div className="w-1/4 mr-2 relative">
                        <label htmlFor="FechaCompra" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha de la compra:</label>
                        <div className="flex">
                            <input type="date" id="FechaCompra" className="w-full pl-10 pr-2 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                        </div>
                    </div>
                    <div className="w-1/4 mr-2 relative">
                        <label htmlFor="DescuentoCompra" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descuento de la compra:</label>
                        <div className="flex">
                            <input type="text" id="DescuentoCompra" className="w-full pl-10 pr-2 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Descuento"/>
                        </div>
                    </div>
                    <div className="w-1/4 mr-2 relative">
                        <label htmlFor="IvaCompra" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">IVA compra:</label>
                        <div className="flex">
                            <input type="text" id="IvaCompra" className="w-full pl-10 pr-2 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="IVA"/>
                        </div>
                    </div>
                    <div className="w-1/4">
                        <label htmlFor="SubtotalCompra" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subtotal compra:</label>
                        <input type="text" id="SubtotalCompra" className="w-full rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Subtotal" disabled/>
                    </div>
                </div>
        </div>
    );
}

export default CrearCompra;
