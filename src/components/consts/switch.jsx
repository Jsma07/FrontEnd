import * as React from 'react';
import Switch from '@mui/material/Switch';

function CustomSwitch({ active, onToggle }) {
  const handleClick = () => {
    onToggle(!active);  // Este evento cambia el estado cuando se hace clic en el Switch
  };

  return (
    <Switch
      checked={active}
      onClick={handleClick}
      color="primary"
    />
  );
}

export default CustomSwitch;
