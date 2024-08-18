import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardCard from './dashboardCard'; 
import DoughnutChart from './dashboardCirculo'; 
import VentasPorMes from '../../components/consts/ventaspormes';
import ComparacionSemanal from '../../components/consts/comparacionSemanal';

import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const Dashboard = () => {
    const [totalClientes, setTotalClientes] = useState(0);
    const [totalVentas, setTotalVentas] = useState(0);
    const [totalCompras, setTotalCompras] = useState(0);
    const [totalServicios, setTotalServicios] = useState(0);
    const [totalEmpleados, setTotalEmpleados] = useState(0);
    const [serviciosMasAgendados, setServiciosMasAgendados] = useState([]);

    useEffect(() => {
        fetchServiciosMasAgendados();
        fetchTotalServicios();
        fetchTotalClientes();
        fetchTotalCompras();
        fetchTotalVentas();
        fetchTotalEmpleados();
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

    const fetchTotalEmpleados = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/totalempleados");
            setTotalEmpleados(response.data.totalEmpleados);
        } catch (error) {
            console.error("Error fetching empleados:", error);
        }
    };

    const fetchServiciosMasAgendados = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/masagendados");
            setServiciosMasAgendados(response.data);
        } catch (error) {
            console.error("Error fetching servicios más agendados:", error);
        }
    };

    const chartData = {
        labels: serviciosMasAgendados.map(servicio => servicio.Nombre_Servicio),
        datasets: [{
            label: 'Cantidad de Agendamientos',
            data: serviciosMasAgendados.map(servicio => servicio.cantidadAgendamientos),
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1,
        }]
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`
                }
            }
        }
    };

    const handleClick = (url) => {
        window.location.href = url;
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', // Coloca los elementos en una columna
            alignItems: 'flex-start', 
            padding: '20px',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            marginTop: '-10px'
        }}>
            {/* Contenedor para las tarjetas */}
            <div style={{
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '20px', 
                width: '100%', // Asegura que el contenedor tome todo el ancho disponible
                marginBottom: '20px' // Añade espacio entre las tarjetas y la gráfica
            }}>
                <DashboardCard 
                    title="Clientes" 
                    count={totalClientes} 
                    iconClass="bx bx-user" 
                    onClick={() => handleClick('/Clientes')} 
                />
                <DashboardCard 
                    title="Ventas" 
                    count={totalVentas} 
                    iconClass="bx bx-money" 
                    onClick={() => handleClick('/ventas')} 
                />
                 <DashboardCard 
                    title="Empleados" 
                    count={totalEmpleados} 
                    iconClass="bx bx-money" 
                    onClick={() => handleClick('/empleados')} 
                />
                <DashboardCard 
                    title="Compras" 
                    count={totalCompras} 
                    iconClass="bx bx-box" 
                    onClick={() => handleClick('/Compras')} 
                />
                <DashboardCard 
                    title="Servicios" 
                    count={totalServicios} 
                    iconClass="bx bx-calendar" 
                    onClick={() => handleClick('/Servicios')} 
                />
            </div>
    
            <div style={{ 
                 width: '300px', 
                 height: '370px', 
                 border: '1px solid rgba(0, 0, 0, 0.2)',
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 borderRadius: '10px',
                 backgroundColor: '#ffffff', // Fondo blanco para un contraste claro
                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Sombra sutil
                 padding: '10px',
                 transition: 'transform 0.3s ease-in-out',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} // Escalar al pasar el ratón
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
            <h3 style={{ margin: '3px 0', fontSize: '1.5rem', color: '#444', fontFamily: 'Arial, sans-serif' }}>Servicios más vendidos</h3>
            <div style={{ 
                    width: '100%', 
                    height: 'calc(100% - 40px)', // Ajusta la altura para evitar desbordamientos
                    position: 'relative'
                }}>
                    <DoughnutChart data={chartData} options={chartOptions} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                </div>
            </div>
            <ComparacionSemanal />
            <VentasPorMes />
        </div>
    );
    
};

export default Dashboard;
