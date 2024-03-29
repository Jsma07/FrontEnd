import { Button } from '@mui/material'
import React from 'react'

const commonButon = ({children, color, disabled, size, variant, sx}) => {
  return (
    <Button
    color= {color}
    disabled= {disabled}
    size={size}
    variant={variant}
    sx={sx}
    
    >
      {children}
    </Button>
  )
}

export default commonButon
