import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { Box, Paper } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

const StyledStaticDatePicker = ({ date, onDateChange }) => {
  const today = dayjs().startOf('day');
  const endOfNextMonth = dayjs().add(1, 'month').endOf('month');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2
        }}
      >
        <Paper 
          elevation={5}
          sx={{
            borderRadius: '20px',
            border: '1px solid #3f51b5',
            padding: 2,
            backgroundColor: '#fff'
          }}
        >
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            orientation="landscape"
            openTo="day"
            value={date}
            onChange={(newValue) => {
              onDateChange(newValue);
            }}
            minDate={today}
            maxDate={endOfNextMonth}
            componentsProps={{
              actionBar: {
                actions: [],
              },
            }}
            renderInput={(params) => <Box {...params} />}
          />
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default StyledStaticDatePicker;
