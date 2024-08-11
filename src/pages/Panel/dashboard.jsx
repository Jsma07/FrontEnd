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
    const handleClick = (url) => {
        window.location.href = url;
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            position: 'relative', 
            gap: '20px', 
            marginTop: '-290px',
        }}>
            <div style={{ 
                backgroundColor: '#fff7e5', 
                color: 'black', 
                padding: '20px', 
                borderRadius: '12px', 
                width: '23%', 
                textAlign: 'center', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                transform: 'translateY(-10px)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                    cursor: 'pointer',
                  
            }}
            onClick={() => handleClick('/Clientes')} // Redirige a la ruta '/ruta-clientes'
          

            >
 <div style={{ 
            backgroundColor: '#EFD4F5', // Fondo blanco para el cuadrado del ícono
            width: '45px', 
            height: '45px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderRadius: '100%', // Borde redondeado opcional
            position: 'absolute', 
            border: '1px solid rgba(0, 0, 0, 0.2)',
            left: '10px' 
        }}>
            <i className='bx bx-user' style={{ fontSize: '1.5rem', color: 'black' }}></i>
        </div>        <div style={{ marginLeft: '45px' }}>
            <p style={{ fontSize: '1.5rem', margin: '0' }}>Clientes</p>
            <h2 style={{ fontSize: '1.5rem', margin: '0' }}>{totalClientes}</h2>
        </div>
            </div>
            <div style={{ 
                backgroundColor: '#fff7e5', 
                color: 'black', 
                padding: '20px', 
                borderRadius: '12px', 
                width: '23%', 
                textAlign: 'center', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                transform: 'translateY(-10px)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
               

            }}
            onClick={() => handleClick('/ventas')} // Redirige a la ruta '/ruta-clientes'
           
            >
               <div style={{ 
            backgroundColor: '#EFD4F5', // Fondo blanco para el cuadrado del ícono
            width: '45px', 
            height: '45px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderRadius: '100%', // Borde redondeado opcional
            position: 'absolute', 
            border: '1px solid rgba(0, 0, 0, 0.2)',
            left: '10px' 
        }}>
            <i className='bx bx-money' style={{ fontSize: '1.5rem', color: 'black' }}></i>
        </div>        <div style={{ marginLeft: '45px' }}>
            <p style={{ fontSize: '1.5rem', margin: '0' }}>Ventas</p>
            <h2 style={{ fontSize: '1.5rem', margin: '0' }}>{totalVentas}</h2>
        </div>
            </div>
            <div style={{ 
                backgroundColor: '#fff7e5', 
                color: 'black', 
                padding: '20px', 
                borderRadius: '12px', 
                width: '23%', 
                textAlign: 'center', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                transform: 'translateY(-10px)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
                transform: 'scale(1)',
                transformOrigin: 'center',
                overflow: 'hidden',

            }}
            onClick={() => handleClick('/compras')} // Redirige a la ruta '/ruta-clientes'
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Aumenta el tamaño al pasar el ratón
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // Vuelve al tamaño original al salir el ratón
>
               <div style={{ 
            backgroundColor: '#EFD4F5', // Fondo blanco para el cuadrado del ícono
            width: '45px', 
            height: '45px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderRadius: '100%', // Borde redondeado opcional
            position: 'absolute', 
            border: '1px solid rgba(0, 0, 0, 0.2)',
            left: '10px' 
        }}>
            <i className='bx bx-cart-alt' style={{ fontSize: '1.5rem', color: 'black' }}></i>
        </div>        <div style={{ marginLeft: '45px' }}>
            <p style={{ fontSize: '1.5rem', margin: '0' }}>Compras</p>
            <h2 style={{ fontSize: '1.5rem', margin: '0' }}>{totalCompras}</h2>
        </div>
            </div>
            <div style={{ 
                backgroundColor: '#fff7e5', 
                color: 'black', 
                padding: '20px', 
                borderRadius: '12px', 
                width: '23%', 
                textAlign: 'center', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                transform: 'translateY(-10px)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
                transform: 'scale(1)',
                transformOrigin: 'center',

            }}
            onClick={() => handleClick('/agendamiento/Servicios')} // Redirige a la ruta '/ruta-clientes'
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Aumenta el tamaño al pasar el ratón
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // Vuelve al tamaño original al salir el ratón
>
                <div style={{ 
            backgroundColor: '#EFD4F5', // Fondo blanco para el cuadrado del ícono
            width: '45px', 
            height: '45px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderRadius: '100%', // Borde redondeado opcional
            position: 'absolute', 
            border: '1px solid rgba(0, 0, 0, 0.2)',
            left: '10px' 
        }}>
            <i className='bx bx-spray-can' style={{ fontSize: '1.5rem', color: 'black' }}></i>
        </div>        <div style={{ marginLeft: '45px' }}>
            <p style={{ fontSize: '1.5rem', margin: '0' }}>Servicios</p>
            <h2 style={{ fontSize: '1.5rem', margin: '0' }}>{totalServicios}</h2>
        </div>
            </div>
        </div>
    );
};

export default Dashboard;
