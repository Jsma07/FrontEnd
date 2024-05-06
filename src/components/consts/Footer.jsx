import React from "react";
import { Box, Grid, Typography, IconButton } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <Box bgcolor="primary.main" py={3} color="white">
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="body1">Nombre de la Empresa</Typography>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="WhatsApp"
            component="a"
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
          </IconButton>
          <IconButton
            aria-label="Facebook"
            component="a"
            href="https://www.facebook.com/tuempresa"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            aria-label="Instagram"
            component="a"
            href="https://www.instagram.com/tuempresa"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
