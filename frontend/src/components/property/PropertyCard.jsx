import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import { motion } from 'framer-motion';
import { addToFavorites, removeFromFavorites } from '../../features/favorites/favoriteSlice';
import { setNotification } from '../../features/ui/uiSlice';

const PropertyCard = ({ property }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);

  // Verificar si la propiedad está en favoritos
  const isFavorite = favorites.some((fav) => fav.id === property.id);

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Manejar clic en favorito
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

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
      dispatch(removeFromFavorites(property.id));
      dispatch(
        setNotification({
          message: 'Propiedad eliminada de favoritos',
          type: 'success',
        })
      );
    } else {
      dispatch(addToFavorites(property.id));
      dispatch(
        setNotification({
          message: 'Propiedad añadida a favoritos',
          type: 'success',
        })
      );
    }
  };

  // Obtener etiqueta según el estado de la propiedad
  const getStatusChip = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <Chip label="Disponible" color="success" size="small" />;
      case 'SOLD':
        return <Chip label="Vendido" color="error" size="small" />;
      case 'RENTED':
        return <Chip label="Alquilado" color="error" size="small" />;
      case 'PENDING':
        return <Chip label="Pendiente" color="warning" size="small" />;
      default:
        return null;
    }
  };

  // Obtener etiqueta según el tipo de operación
  const getOperationChip = (operation) => {
    switch (operation) {
      case 'SALE':
        return <Chip label="Venta" color="primary" size="small" />;
      case 'RENT':
        return <Chip label="Alquiler" color="secondary" size="small" />;
      default:
        return null;
    }
  };

  if (!property) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" height={30} width="80%" />
          <Skeleton variant="text" height={20} width="60%" />
          <Skeleton variant="text" height={20} width="40%" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            '& .MuiCardMedia-root': {
              transform: 'scale(1.05)',
            },
          },
        }}
      >
        <CardActionArea component={RouterLink} to={`/properties/${property.id}`}>
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="200"
              image={property.images && property.images.length > 0 ? property.images[0].url : 'https://picsum.photos/800/600?random=0'}
              alt={property.title}
              sx={{
                objectFit: 'cover',
                transition: 'transform 0.3s ease-in-out',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                display: 'flex',
                gap: 1,
                zIndex: 1,
              }}
            >
              {getStatusChip(property.status)}
              {getOperationChip(property.operation)}
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 1,
              }}
            >
              <IconButton
                onClick={handleFavoriteClick}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 1)',
                  },
                }}
              >
                {isFavorite ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                color: 'white',
                p: 2,
              }}
            >
              <Typography variant="h6" component="h3" noWrap>
                {property.title}
              </Typography>
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: 'bold', mb: 1 }}
              >
                {formatPrice(property.price)}
                {property.operation === 'RENT' && '/mes'}
              </Typography>
            </Box>
          </Box>

          <CardContent>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
            >
              <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
              {property.city}, {property.state}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 2,
              }}
            >
              <Tooltip title="Habitaciones">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BedIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">{property.bedrooms}</Typography>
                </Box>
              </Tooltip>

              <Tooltip title="Baños">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BathtubIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">{property.bathrooms}</Typography>
                </Box>
              </Tooltip>

              <Tooltip title="Superficie">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SquareFootIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">{property.area} m²</Typography>
                </Box>
              </Tooltip>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </motion.div>
  );
};

export default PropertyCard; 