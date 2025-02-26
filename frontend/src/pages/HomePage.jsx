import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Typography, 
  TextField, 
  InputAdornment,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BusinessIcon from '@mui/icons-material/Business';
import LandscapeIcon from '@mui/icons-material/Landscape';

import { getProperties } from '../features/properties/propertySlice';
import PropertyCard from '../components/property/PropertyCard';

const HomePage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { properties, isLoading } = useSelector((state) => state.properties);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getProperties({ limit: 6 }));
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implementar búsqueda
  };

  const propertyTypes = [
    { 
      title: 'Casas', 
      icon: <HomeIcon fontSize="large" color="primary" />, 
      link: '/properties?type=HOUSE' 
    },
    { 
      title: 'Apartamentos', 
      icon: <ApartmentIcon fontSize="large" color="primary" />, 
      link: '/properties?type=APARTMENT' 
    },
    { 
      title: 'Comercial', 
      icon: <BusinessIcon fontSize="large" color="primary" />, 
      link: '/properties?type=COMMERCIAL' 
    },
    { 
      title: 'Terrenos', 
      icon: <LandscapeIcon fontSize="large" color="primary" />, 
      link: '/properties?type=LAND' 
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <Box
        className="hero-section"
        sx={{
          py: { xs: 8, md: 12 },
          px: 2,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              animation: 'fadeIn 1s ease-in',
            }}
          >
            Encuentra tu hogar ideal
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 5,
              maxWidth: '800px',
              mx: 'auto',
              animation: 'slideUp 1s ease-out',
              animationDelay: '0.3s',
              animationFillMode: 'both',
            }}
          >
            Descubre propiedades exclusivas en las mejores ubicaciones
          </Typography>

          {/* Buscador */}
          <Paper
            component="form"
            onSubmit={handleSearch}
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              maxWidth: 600,
              mx: 'auto',
              mb: 4,
              borderRadius: 2,
              boxShadow: 3,
              animation: 'scaleIn 0.5s ease-in-out',
              animationDelay: '0.6s',
              animationFillMode: 'both',
            }}
          >
            <InputAdornment position="start" sx={{ pl: 2 }}>
              <LocationOnIcon color="primary" />
            </InputAdornment>
            <TextField
              fullWidth
              placeholder="Buscar por ciudad, estado o código postal"
              value={searchTerm}
              onChange={handleSearchChange}
              variant="standard"
              InputProps={{
                disableUnderline: true,
              }}
              sx={{ ml: 1, flex: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ borderRadius: '0 8px 8px 0', py: 1, px: 3 }}
              endIcon={<SearchIcon />}
            >
              Buscar
            </Button>
          </Paper>

          <Button
            variant="outlined"
            color="inherit"
            component={RouterLink}
            to="/properties"
            size="large"
            sx={{
              mt: 2,
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              animation: 'fadeIn 1s ease-in',
              animationDelay: '0.9s',
              animationFillMode: 'both',
            }}
          >
            Ver todas las propiedades
          </Button>
        </Container>
      </Box>

      {/* Tipos de propiedades */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          className="section-title"
          sx={{ mb: 6, textAlign: 'center' }}
        >
          Explora por tipo de propiedad
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {propertyTypes.map((type, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Card
                component={RouterLink}
                to={type.link}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  p: 3,
                  textDecoration: 'none',
                  color: 'text.primary',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4,
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{type.icon}</Box>
                <Typography variant="h6" component="h3">
                  {type.title}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Propiedades destacadas */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              component="h2"
              className="section-title"
            >
              Propiedades destacadas
            </Typography>
            <Button
              variant="outlined"
              component={RouterLink}
              to="/properties"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Ver todas
            </Button>
          </Box>

          <Grid container spacing={4}>
            {isLoading ? (
              // Mostrar placeholders durante la carga
              Array.from(new Array(3)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ bgcolor: 'grey.300', height: 200 }} />
                    <CardContent>
                      <Box sx={{ bgcolor: 'grey.300', height: 20, width: '80%', mb: 1 }} />
                      <Box sx={{ bgcolor: 'grey.300', height: 20, width: '60%' }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : properties.length > 0 ? (
              properties.map((property) => (
                <Grid item xs={12} sm={6} md={4} key={property.id}>
                  <PropertyCard property={property} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" textAlign="center">
                  No hay propiedades disponibles en este momento.
                </Typography>
              </Grid>
            )}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              component={RouterLink}
              to="/properties"
              sx={{ display: { xs: 'block', sm: 'none' } }}
            >
              Ver todas las propiedades
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Sección de servicios */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          className="section-title"
          sx={{ mb: 6, textAlign: 'center' }}
        >
          Nuestros servicios
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <HomeIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography gutterBottom variant="h5" component="h3">
                  Compra de propiedades
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Encuentra la casa de tus sueños con nuestra amplia selección de propiedades en venta.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <ApartmentIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography gutterBottom variant="h5" component="h3">
                  Alquiler de propiedades
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Explora nuestras opciones de alquiler con los mejores precios y ubicaciones.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <BusinessIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography gutterBottom variant="h5" component="h3">
                  Asesoría inmobiliaria
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Nuestros agentes expertos te guiarán en todo el proceso de compra o venta.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            ¿Listo para encontrar tu próxima propiedad?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Nuestros agentes inmobiliarios están listos para ayudarte a encontrar la propiedad perfecta.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={RouterLink}
            to="/properties"
          >
            Explorar propiedades
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default HomePage; 