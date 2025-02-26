import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Breadcrumbs,
  Link,
  Skeleton,
  ImageList,
  ImageListItem,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  LocationOn as LocationOnIcon,
  Bed as BedIcon,
  Bathtub as BathtubIcon,
  SquareFoot as SquareFootIcon,
  Home as HomeIcon,
  DirectionsCar as DirectionsCarIcon,
  Pool as PoolIcon,
  Deck as DeckIcon,
  AcUnit as AcUnitIcon,
  Fireplace as FireplaceIcon,
  Elevator as ElevatorIcon,
  Security as SecurityIcon,
  Chair as ChairIcon,
  NavigateNext as NavigateNextIcon,
  Send as SendIcon,
} from '@mui/icons-material';

import { getPropertyById, clearProperty } from '../features/properties/propertySlice';
import { addToFavorites, removeFromFavorites } from '../features/favorites/favoriteSlice';
import { sendMessage } from '../features/messages/messageSlice';
import { setNotification } from '../features/ui/uiSlice';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { property, isLoading } = useSelector((state) => state.properties);
  const { user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);
  
  const [activeTab, setActiveTab] = useState(0);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Verificar si la propiedad está en favoritos
  const isFavorite = favorites.some((fav) => fav.id === id);
  
  useEffect(() => {
    dispatch(getPropertyById(id));
    
    // Limpiar al desmontar
    return () => {
      dispatch(clearProperty());
    };
  }, [dispatch, id]);
  
  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  // Manejar clic en favorito
  const handleFavoriteClick = () => {
    if (!user) {
      dispatch(
        setNotification({
          message: 'Debes iniciar sesión para añadir a favoritos',
          type: 'info',
        })
      );
      return;
    }
    
    if (isFavorite) {
      dispatch(removeFromFavorites(id));
      dispatch(
        setNotification({
          message: 'Propiedad eliminada de favoritos',
          type: 'success',
        })
      );
    } else {
      dispatch(addToFavorites(id));
      dispatch(
        setNotification({
          message: 'Propiedad añadida a favoritos',
          type: 'success',
        })
      );
    }
  };
  
  // Manejar cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Abrir diálogo de contacto
  const handleOpenContactDialog = () => {
    if (!user) {
      dispatch(
        setNotification({
          message: 'Debes iniciar sesión para contactar al agente',
          type: 'info',
        })
      );
      navigate('/login');
      return;
    }
    
    setContactDialogOpen(true);
  };
  
  // Cerrar diálogo de contacto
  const handleCloseContactDialog = () => {
    setContactDialogOpen(false);
  };
  
  // Enviar mensaje
  const handleSendMessage = () => {
    if (message.trim() === '') {
      dispatch(
        setNotification({
          message: 'El mensaje no puede estar vacío',
          type: 'error',
        })
      );
      return;
    }
    
    dispatch(
      sendMessage({
        propertyId: id,
        agentId: property.agent.id,
        content: message,
      })
    );
    
    setMessage('');
    setContactDialogOpen(false);
    
    dispatch(
      setNotification({
        message: 'Mensaje enviado correctamente',
        type: 'success',
      })
    );
  };
  
  // Obtener icono para característica
  const getFeatureIcon = (feature) => {
    switch (feature.toLowerCase()) {
      case 'piscina':
        return <PoolIcon />;
      case 'jardín':
        return <DeckIcon />;
      case 'garaje':
        return <DirectionsCarIcon />;
      case 'terraza':
        return <DeckIcon />;
      case 'aire acondicionado':
        return <AcUnitIcon />;
      case 'calefacción':
        return <FireplaceIcon />;
      case 'ascensor':
        return <ElevatorIcon />;
      case 'amueblado':
        return <ChairIcon />;
      case 'seguridad':
        return <SecurityIcon />;
      default:
        return <HomeIcon />;
    }
  };
  
  // Obtener etiqueta según el estado de la propiedad
  const getStatusChip = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <Chip label="Disponible" color="success" />;
      case 'SOLD':
        return <Chip label="Vendido" color="error" />;
      case 'RENTED':
        return <Chip label="Alquilado" color="error" />;
      case 'PENDING':
        return <Chip label="Pendiente" color="warning" />;
      default:
        return null;
    }
  };
  
  // Obtener etiqueta según el tipo de operación
  const getOperationChip = (operation) => {
    switch (operation) {
      case 'SALE':
        return <Chip label="Venta" color="primary" />;
      case 'RENT':
        return <Chip label="Alquiler" color="secondary" />;
      default:
        return null;
    }
  };
  
  if (isLoading || !property) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" height={40} width="60%" />
        <Skeleton variant="text" height={30} width="40%" />
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} />
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" height={30} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        </Grid>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Migas de pan */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
      >
        <Link component={RouterLink} to="/" color="inherit">
          Inicio
        </Link>
        <Link component={RouterLink} to="/properties" color="inherit">
          Propiedades
        </Link>
        <Typography color="text.primary">{property.title}</Typography>
      </Breadcrumbs>
      
      {/* Título y ubicación */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {property.title}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {getStatusChip(property.status)}
            {getOperationChip(property.operation)}
          </Box>
        </Box>
        
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
          {property.address}, {property.city}, {property.state}, {property.country}
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Galería de imágenes */}
          <Box sx={{ mb: 4 }}>
            {property.images && property.images.length > 0 ? (
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={property.images[selectedImage].url}
                  alt={property.title}
                  sx={{
                    width: '100%',
                    height: { xs: 300, md: 500 },
                    objectFit: 'cover',
                    borderRadius: 2,
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    mt: 2,
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': {
                      height: 8,
                    },
                    '&::-webkit-scrollbar-track': {
                      bgcolor: 'background.paper',
                      borderRadius: 4,
                    },
                    '&::-webkit-scrollbar-thumb': {
                      bgcolor: 'primary.main',
                      borderRadius: 4,
                    },
                  }}
                >
                  {property.images.map((image, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={image.url}
                      alt={`${property.title} - Imagen ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: 100,
                        height: 75,
                        objectFit: 'cover',
                        borderRadius: 1,
                        cursor: 'pointer',
                        border: selectedImage === index ? '2px solid' : 'none',
                        borderColor: 'primary.main',
                        opacity: selectedImage === index ? 1 : 0.7,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          opacity: 1,
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: { xs: 300, md: 500 },
                  bgcolor: 'grey.300',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No hay imágenes disponibles
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* Pestañas de información */}
          <Box sx={{ mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              aria-label="property information tabs"
            >
              <Tab label="Descripción" />
              <Tab label="Características" />
              <Tab label="Ubicación" />
            </Tabs>
            
            <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderTop: 0 }}>
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Descripción
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {property.description}
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BedIcon color="primary" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Habitaciones
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {property.bedrooms}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BathtubIcon color="primary" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Baños
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {property.bathrooms}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SquareFootIcon color="primary" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Superficie
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {property.area} m²
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <HomeIcon color="primary" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Tipo
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {property.propertyType}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Características
                  </Typography>
                  
                  {property.features && property.features.length > 0 ? (
                    <Grid container spacing={2}>
                      {property.features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getFeatureIcon(feature)}
                            <Typography variant="body1" sx={{ ml: 1 }}>
                              {feature}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No hay características disponibles
                    </Typography>
                  )}
                </Box>
              )}
              
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Ubicación
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    {property.address}, {property.city}, {property.state}, {property.country}
                  </Typography>
                  
                  <Box
                    sx={{
                      width: '100%',
                      height: 300,
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Mapa no disponible
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Tarjeta de precio */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>
                {formatPrice(property.price)}
                {property.operation === 'RENT' && '/mes'}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleOpenContactDialog}
                sx={{ mb: 2 }}
              >
                Contactar con el agente
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={handleFavoriteClick}
              >
                {isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              </Button>
            </CardContent>
          </Card>
          
          {/* Tarjeta del agente */}
          {property.agent && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Agente inmobiliario
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={property.agent.avatar || ''}
                    alt={property.agent.name}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1">
                      {property.agent.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Agente inmobiliario
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body2" paragraph>
                  <strong>Email:</strong> {property.agent.email}
                </Typography>
                
                <Typography variant="body2" paragraph>
                  <strong>Teléfono:</strong> {property.agent.phone || 'No disponible'}
                </Typography>
                
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleOpenContactDialog}
                >
                  Enviar mensaje
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
      
      {/* Diálogo de contacto */}
      <Dialog open={contactDialogOpen} onClose={handleCloseContactDialog}>
        <DialogTitle>Contactar con el agente</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Envía un mensaje al agente para obtener más información sobre esta propiedad.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Mensaje"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseContactDialog}>Cancelar</Button>
          <Button 
            onClick={handleSendMessage} 
            variant="contained" 
            startIcon={<SendIcon />}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PropertyDetailPage; 