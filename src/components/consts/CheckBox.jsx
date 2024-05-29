import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';

export default function ControlledCheckbox({ checked, onChange, onClick }) {
  const handleChange = (event) => {
    onChange(event.target.checked);
  };

  return (
    <Checkbox
      checked={checked}
      onChange={handleChange}
      onClick={onClick} // Agregamos onClick
      inputProps={{ 'aria-label': 'controlled' }}
    />
  );
}
