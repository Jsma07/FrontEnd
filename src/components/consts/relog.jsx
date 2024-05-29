import React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

export default function Relog() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'MobileTimePicker',
        ]}
      >
        <DemoItem label="Mobile variant">
          <MobileTimePicker 
            defaultValue={dayjs('2022-04-17T15:30')} 
            ampm={false} 
            ampmInClock={false} 
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
