import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [totalClientes, setTotalClientes] = useState(0);
    const [totalVentas, setTotalVentas] = useState(0);
    const [totalCompras, setTotalCompras] = useState(0);
    const [totalServicios, setTotalServicios] = useState(0);


    useEffect(() => {
        fetchTotalServicios();
        fetchTotalClientes();
        fetchTotalCompras();
        fetchTotalVentas();
    }, []);

    const fetchTotalClientes = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/totalclientes");
            setTotalClientes(response.data.totalClientes); 
        } catch (error) {
            console.error("Error fetching clientes:", error);
        }
    };

    const fetchTotalVentas = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/totalventas");
            setTotalVentas(response.data.totalVentas); 
        } catch (error) {
            console.error("Error fetching ventas:", error);
        }
    };

    const fetchTotalCompras = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/totalcompras");
            setTotalCompras(response.data.totalCompras); 
        } catch (error) {
            console.error("Error fetching compras:", error);
        }
    };

    const fetchTotalServicios = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/totalservicios");
            setTotalServicios(response.data.totalServicios); 
        } catch (error) {
            console.error("Error fetching servicios:", error);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            padding: '20px', 
            position: 'relative', 
            gap: '10px', 
            top: '-290px',
        }}>
            <div style={{ 
                backgroundColor: '#FF8C9E', 
                color: '#fff', 
                padding: '30px', 
                borderRadius: '8px', 
                width: '24%', 
                textAlign: 'center', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                transform: 'translateY(-10px)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
            }}>
                {/* <i className='bx bx-user' style={{ fontSize: '2rem', marginRight: '10px' }}></i> */}
                <div>
                    <p style={{ fontSize: '1.5rem', margin: '0' }}>Clientes</p>
                    <h2 style={{ fontSize: '2rem', margin: '0' }}>{totalClientes}</h2>
                </div>
            </div>
            <div style={{ 
                backgroundColor: '#B692C2', 
                color: '#fff', 
                padding: '30px', 
                borderRadius: '8px', 
                width: '24%', 
                textAlign: 'center', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                transform: 'translateY(-10px)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
            }}>
                {/* <i className='bx bx-money' style={{ fontSize: '2rem', marginRight: '10px' }}></i> */}
                <div>
                    <p style={{ fontSize: '1.5rem', margin: '0' }}>Ventas</p>
                    <h2 style={{ fontSize: '2rem', margin: '0' }}>{totalVentas}</h2>
                </div>
            </div>
            <div style={{ 
                backgroundColor: '#96CEB4', 
                color: '#fff', 
                padding: '30px', 
                borderRadius: '8px', 
                width: '24%', 
                textAlign: 'center', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                transform: 'translateY(-10px)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
            }}>
                {/* <i className='bx bx-box' style={{ fontSize: '2rem', marginRight: '10px' }}></i> */}
                <div>
                    <p style={{ fontSize: '1.5rem', margin: '0' }}>Compras</p>
                    <h2 style={{ fontSize: '2rem', margin: '0' }}>{totalCompras}</h2>
                </div>
            </div>
            <div style={{ 
                backgroundColor: '#6EACDA', 
                color: '#fff', 
                padding: '30px', 
                borderRadius: '8px', 
                width: '24%', 
                textAlign: 'center', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                transform: 'translateY(-10px)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
            }}>
                {/* <i className='bx bx-calendar' style={{ fontSize: '2rem', marginRight: '10px' }}></i> */}
                <div>
                    <p style={{ fontSize: '1.5rem', margin: '0' }}>Servicios</p>
                    <h2 style={{ fontSize: '2rem', margin: '0' }}>{totalServicios}</h2>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
