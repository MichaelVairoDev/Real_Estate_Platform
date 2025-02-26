import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Pagination,
  Drawer,
  Button,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Card,
  CardContent,
  Paper,
  Fab,
  Zoom,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import TuneIcon from '@mui/icons-material/Tune';
import { Add as AddIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

import { getProperties, searchProperties, setFilters, clearFilters } from '../features/properties/propertySlice';
import PropertyCard from '../components/property/PropertyCard';
import SearchBar from '../components/property/SearchBar';
import PropertyForm from '../components/property/PropertyForm';
import { openModal } from '../features/ui/uiSlice';

const PropertyListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { properties, isLoading, pagination, filters } = useSelector((state) => state.properties);
  const { user } = useSelector((state) => state.auth);
  
  const [openFilters, setOpenFilters] = useState(!isMobile);
  const [localFilters, setLocalFilters] = useState(filters);
  const [sortBy, setSortBy] = useState('newest');
  const [showCreateButton, setShowCreateButton] = useState(false);
  
  // Obtener parámetros de la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlFilters = {};
    
    // Extraer filtros de la URL
    if (params.has('type')) urlFilters.propertyType = params.get('type');
    if (params.has('city')) urlFilters.city = params.get('city');
    if (params.has('operation')) urlFilters.operation = params.get('operation');
    if (params.has('minPrice')) urlFilters.minPrice = params.get('minPrice');
    if (params.has('maxPrice')) urlFilters.maxPrice = params.get('maxPrice');
    
    // Actualizar filtros locales y en Redux
    if (Object.keys(urlFilters).length > 0) {
      setLocalFilters({ ...filters, ...urlFilters });
      dispatch(setFilters(urlFilters));
    }
    
    // Cargar propiedades
    dispatch(getProperties({ page: pagination.page, limit: pagination.limit, ...urlFilters }));
  }, [dispatch, location.search]);
  
  useEffect(() => {
    // Mostrar botón flotante después de un scroll
    const handleScroll = () => {
      setShowCreateButton(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Manejar cambio de página
  const handlePageChange = (event, value) => {
    dispatch(getProperties({ page: value, limit: pagination.limit, ...filters }));
    window.scrollTo(0, 0);
  };
  
  // Manejar cambio de filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({ ...localFilters, [name]: value });
  };
  
  // Manejar cambio de características (checkboxes)
  const handleFeatureChange = (feature) => {
    const features = [...localFilters.features];
    const index = features.indexOf(feature);
    
    if (index === -1) {
      features.push(feature);
    } else {
      features.splice(index, 1);
    }
    
    setLocalFilters({ ...localFilters, features });
  };
  
  // Aplicar filtros
  const applyFilters = () => {
    dispatch(setFilters(localFilters));
    dispatch(searchProperties({ page: 1, limit: pagination.limit, ...localFilters }));
    
    // Actualizar URL con filtros
    const params = new URLSearchParams();
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value && value !== '' && key !== 'features') {
        params.append(key, value);
      }
    });
    
    navigate({ search: params.toString() });
    
    if (isMobile) {
      setOpenFilters(false);
    }
  };
  
  // Limpiar filtros
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setLocalFilters({
      city: '',
      state: '',
      country: '',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      maxBedrooms: '',
      minBathrooms: '',
      maxBathrooms: '',
      minArea: '',
      maxArea: '',
      propertyType: '',
      status: 'ACTIVE',
      features: []
    });
    dispatch(getProperties({ page: 1, limit: pagination.limit }));
    navigate('/properties');
  };
  
  // Manejar cambio de ordenación
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    // Implementar ordenación
  };
  
  // Lista de características para filtrar
  const featuresList = [
    'Piscina',
    'Jardín',
    'Garaje',
    'Terraza',
    'Aire acondicionado',
    'Calefacción',
    'Ascensor',
    'Amueblado',
    'Seguridad'
  ];
  
  // Tipos de propiedades
  const propertyTypes = [
    { value: '', label: 'Todos los tipos' },
    { value: 'HOUSE', label: 'Casa' },
    { value: 'APARTMENT', label: 'Apartamento' },
    { value: 'CONDO', label: 'Condominio' },
    { value: 'LAND', label: 'Terreno' },
    { value: 'COMMERCIAL', label: 'Comercial' },
  ];
  
  // Tipos de operaciones
  const operationTypes = [
    { value: '', label: 'Todas las operaciones' },
    { value: 'SALE', label: 'Venta' },
    { value: 'RENT', label: 'Alquiler' },
  ];
  
  // Opciones de ordenación
  const sortOptions = [
    { value: 'newest', label: 'Más recientes' },
    { value: 'price_asc', label: 'Precio: menor a mayor' },
    { value: 'price_desc', label: 'Precio: mayor a menor' },
    { value: 'area_asc', label: 'Superficie: menor a mayor' },
    { value: 'area_desc', label: 'Superficie: mayor a menor' },
  ];
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const handleCreateProperty = () => {
    dispatch(openModal({
      type: 'property-form',
      data: null
    }));
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Encabezado */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Encuentra tu hogar ideal
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }}
          >
            Explora nuestra selección de propiedades exclusivas
          </Typography>
        </Box>

        {/* Barra de búsqueda */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            background: `linear-gradient(to right bottom, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          }}
        >
          <SearchBar />
        </Paper>

        {/* Lista de propiedades */}
        <Grid container spacing={3}>
          {properties.map((property, index) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Botón flotante para crear propiedad (solo para agentes) */}
        {user?.role === 'AGENT' && (
          <Zoom in={showCreateButton}>
            <Fab
              color="primary"
              aria-label="add property"
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 1000,
              }}
              onClick={handleCreateProperty}
            >
              <AddIcon />
            </Fab>
          </Zoom>
        )}

        {/* Mensaje cuando no hay propiedades */}
        {!isLoading && properties.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Typography variant="h6" gutterBottom>
              No se encontraron propiedades
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Intenta ajustar los filtros de búsqueda
            </Typography>
          </Box>
        )}

        {/* Paginación */}
        {pagination.pages > 1 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={pagination.pages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default PropertyListPage; 