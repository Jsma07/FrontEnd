import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const DoughnutChart = ({ data, options }) => {
    return (
        <div style={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flexDirection: 'column', 
            marginTop: '20px',
            marginBottom: '20px'
        }}>
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default DoughnutChart;
