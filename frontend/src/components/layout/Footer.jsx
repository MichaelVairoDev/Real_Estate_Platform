import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import HomeIcon from '@mui/icons-material/Home';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HomeIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                INMOBILIARIA
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Encuentra la propiedad de tus sueños con nosotros. Ofrecemos las mejores opciones
              en venta y alquiler de propiedades en todo el país.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton aria-label="facebook" color="primary">
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="twitter" color="primary">
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="instagram" color="primary">
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="linkedin" color="primary">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              Enlaces rápidos
            </Typography>
            <Link
              component={RouterLink}
              to="/"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              Inicio
            </Link>
            <Link
              component={RouterLink}
              to="/properties"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              Propiedades
            </Link>
            <Link
              component={RouterLink}
              to="/login"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              Iniciar sesión
            </Link>
            <Link
              component={RouterLink}
              to="/register"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              Registrarse
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              Tipos de propiedades
            </Typography>
            <Link
              component={RouterLink}
              to="/properties?type=HOUSE"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              Casas
            </Link>
            <Link
              component={RouterLink}
              to="/properties?type=APARTMENT"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              Apartamentos
            </Link>
            <Link
              component={RouterLink}
              to="/properties?type=CONDO"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              Condominios
            </Link>
            <Link
              component={RouterLink}
              to="/properties?type=LAND"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              Terrenos
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              Contacto
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Calle Principal #123
              <br />
              Ciudad, Estado 12345
              <br />
              <br />
              Email: info@inmobiliaria.com
              <br />
              Teléfono: (123) 456-7890
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          © {year} Inmobiliaria. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 