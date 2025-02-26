import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Drawer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Chip,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  TuneRounded as TuneIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const SearchBar = ({ variant = 'normal' }) => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    operation: '',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    maxBedrooms: '',
    minBathrooms: '',
    maxBathrooms: '',
    minArea: '',
    maxArea: '',
    features: [],
  });

  const propertyTypes = [
    { value: 'HOUSE', label: 'Casa' },
    { value: 'APARTMENT', label: 'Apartamento' },
    { value: 'CONDO', label: 'Condominio' },
    { value: 'LAND', label: 'Terreno' },
    { value: 'COMMERCIAL', label: 'Comercial' },
  ];

  const operationTypes = [
    { value: 'SALE', label: 'Venta' },
    { value: 'RENT', label: 'Alquiler' },
  ];

  const features = [
    'Piscina',
    'Jardín',
    'Garaje',
    'Terraza',
    'Aire acondicionado',
    'Calefacción',
    'Ascensor',
    'Amueblado',
    'Seguridad',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFilters((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // Construir query params
    const params = new URLSearchParams();

    if (filters.location) params.append('location', filters.location);
    if (filters.type) params.append('type', filters.type);
    if (filters.operation) params.append('operation', filters.operation);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.minBedrooms) params.append('minBedrooms', filters.minBedrooms);
    if (filters.maxBedrooms) params.append('maxBedrooms', filters.maxBedrooms);
    if (filters.minBathrooms) params.append('minBathrooms', filters.minBathrooms);
    if (filters.maxBathrooms) params.append('maxBathrooms', filters.maxBathrooms);
    if (filters.minArea) params.append('minArea', filters.minArea);
    if (filters.maxArea) params.append('maxArea', filters.maxArea);
    if (filters.features.length > 0) {
      filters.features.forEach((feature) => {
        params.append('features[]', feature);
      });
    }

    // Navegar a la página de resultados
    navigate(`/properties?${params.toString()}`);
    setOpenFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({
      location: '',
      type: '',
      operation: '',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      maxBedrooms: '',
      minBathrooms: '',
      maxBathrooms: '',
      minArea: '',
      maxArea: '',
      features: [],
    });
  };

  const mainSearch = (
    <Box
      component="form"
      onSubmit={handleSearch}
      sx={{
        display: 'flex',
        gap: 1,
        width: '100%',
      }}
    >
      <TextField
        fullWidth
        name="location"
        placeholder="Buscar por ubicación..."
        value={filters.location}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <IconButton
        color="primary"
        onClick={() => setOpenFilters(true)}
        sx={{ bgcolor: 'background.paper' }}
      >
        <TuneIcon />
      </IconButton>
      <Button type="submit" variant="contained">
        Buscar
      </Button>
    </Box>
  );

  if (variant === 'hero') {
    return (
      <>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            width: '100%',
            maxWidth: 800,
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          {mainSearch}
        </Paper>
        <FiltersDrawer
          open={openFilters}
          onClose={() => setOpenFilters(false)}
          filters={filters}
          onFilterChange={handleChange}
          onFeatureToggle={handleFeatureToggle}
          onSearch={handleSearch}
          onClear={handleClearFilters}
          propertyTypes={propertyTypes}
          operationTypes={operationTypes}
          features={features}
        />
      </>
    );
  }

  return (
    <>
      {mainSearch}
      <FiltersDrawer
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        filters={filters}
        onFilterChange={handleChange}
        onFeatureToggle={handleFeatureToggle}
        onSearch={handleSearch}
        onClear={handleClearFilters}
        propertyTypes={propertyTypes}
        operationTypes={operationTypes}
        features={features}
      />
    </>
  );
};

const FiltersDrawer = ({
  open,
  onClose,
  filters,
  onFilterChange,
  onFeatureToggle,
  onSearch,
  onClear,
  propertyTypes,
  operationTypes,
  features,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Typography variant="h6">Filtros de búsqueda</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Tipo de operación</InputLabel>
              <Select
                name="operation"
                value={filters.operation}
                onChange={onFilterChange}
                label="Tipo de operación"
              >
                <MenuItem value="">Todas</MenuItem>
                {operationTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Tipo de propiedad</InputLabel>
              <Select
                name="type"
                value={filters.type}
                onChange={onFilterChange}
                label="Tipo de propiedad"
              >
                <MenuItem value="">Todas</MenuItem>
                {propertyTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Precio mínimo"
              name="minPrice"
              type="number"
              value={filters.minPrice}
              onChange={onFilterChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Precio máximo"
              name="maxPrice"
              type="number"
              value={filters.maxPrice}
              onChange={onFilterChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Habitaciones mín."
              name="minBedrooms"
              type="number"
              value={filters.minBedrooms}
              onChange={onFilterChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Habitaciones máx."
              name="maxBedrooms"
              type="number"
              value={filters.maxBedrooms}
              onChange={onFilterChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Baños mín."
              name="minBathrooms"
              type="number"
              value={filters.minBathrooms}
              onChange={onFilterChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Baños máx."
              name="maxBathrooms"
              type="number"
              value={filters.maxBathrooms}
              onChange={onFilterChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Superficie mín."
              name="minArea"
              type="number"
              value={filters.minArea}
              onChange={onFilterChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">m²</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Superficie máx."
              name="maxArea"
              type="number"
              value={filters.maxArea}
              onChange={onFilterChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">m²</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Características
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {features.map((feature) => (
                <Chip
                  key={feature}
                  label={feature}
                  onClick={() => onFeatureToggle(feature)}
                  color={filters.features.includes(feature) ? 'primary' : 'default'}
                />
              ))}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              onClear();
              onClose();
            }}
          >
            Limpiar
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={(e) => {
              onSearch(e);
              onClose();
            }}
          >
            Aplicar filtros
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SearchBar; 