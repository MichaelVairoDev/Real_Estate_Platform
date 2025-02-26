import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';

import {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../../features/properties/propertySlice';
import { setNotification } from '../../features/ui/uiSlice';
import PropertyForm from '../../components/property/PropertyForm';

const PropertiesPage = () => {
  const dispatch = useDispatch();
  const { properties, isLoading, pagination } = useSelector((state) => state.properties);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
  });

  useEffect(() => {
    dispatch(getProperties({ page: page + 1, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (property = null) => {
    setSelectedProperty(property);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedProperty(null);
    setOpenDialog(false);
  };

  const handleDelete = (propertyId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
      dispatch(deleteProperty(propertyId));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implementar búsqueda
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      ACTIVE: { label: 'Activa', color: 'success' },
      PENDING: { label: 'Pendiente', color: 'warning' },
      SOLD: { label: 'Vendida', color: 'error' },
      RENTED: { label: 'Alquilada', color: 'error' },
    };

    const config = statusConfig[status] || { label: status, color: 'default' };

    return <Chip label={config.label} color={config.color} size="small" />;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4" component="h1">
          Gestión de Propiedades
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Propiedad
        </Button>
      </Box>

      {/* Filtros y búsqueda */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Buscar propiedades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                label="Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="ACTIVE">Activa</MenuItem>
                <MenuItem value="PENDING">Pendiente</MenuItem>
                <MenuItem value="SOLD">Vendida</MenuItem>
                <MenuItem value="RENTED">Alquilada</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                label="Tipo"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="HOUSE">Casa</MenuItem>
                <MenuItem value="APARTMENT">Apartamento</MenuItem>
                <MenuItem value="CONDO">Condominio</MenuItem>
                <MenuItem value="LAND">Terreno</MenuItem>
                <MenuItem value="COMMERCIAL">Comercial</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleSearch}
            >
              Filtrar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de propiedades */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>{property.title}</TableCell>
                <TableCell>{property.propertyType}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(property.price)}
                </TableCell>
                <TableCell>
                  {property.city}, {property.state}
                </TableCell>
                <TableCell>{getStatusChip(property.status)}</TableCell>
                <TableCell>
                  {new Date(property.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(property)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(property.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={pagination.total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
        />
      </TableContainer>

      {/* Diálogo de creación/edición */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedProperty ? 'Editar Propiedad' : 'Nueva Propiedad'}
        </DialogTitle>
        <DialogContent>
          <PropertyForm
            property={selectedProperty}
            onSubmit={(data) => {
              if (selectedProperty) {
                dispatch(updateProperty({ id: selectedProperty.id, propertyData: data }));
              } else {
                dispatch(createProperty(data));
              }
              handleCloseDialog();
            }}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PropertiesPage; 