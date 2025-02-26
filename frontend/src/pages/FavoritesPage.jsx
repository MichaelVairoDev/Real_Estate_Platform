import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';

import { getFavorites } from '../features/favorites/favoriteSlice';
import PropertyCard from '../components/property/PropertyCard';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { favorites, isLoading, isError, message } = useSelector(
    (state) => state.favorites
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getFavorites());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mis Favoritos
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {message}
        </Alert>
      )}

      {favorites.length > 0 ? (
        <Grid container spacing={3}>
          {favorites.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <PropertyCard property={property} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          <Typography variant="h6" gutterBottom>
            No tienes propiedades favoritas
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Explora nuestro catálogo y guarda las propiedades que más te gusten
          </Typography>
          <Button
            component={RouterLink}
            to="/properties"
            variant="contained"
            size="large"
          >
            Explorar propiedades
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default FavoritesPage; 