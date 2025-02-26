import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

import { createProperty, updateProperty } from '../../features/properties/propertySlice';
import { closeModal } from '../../features/ui/uiSlice';

const propertyTypes = [
  { value: 'HOUSE', label: 'Casa' },
  { value: 'APARTMENT', label: 'Apartamento' },
  { value: 'CONDO', label: 'Condominio' },
  { value: 'TOWNHOUSE', label: 'Casa adosada' },
  { value: 'LAND', label: 'Terreno' },
  { value: 'COMMERCIAL', label: 'Comercial' },
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

const PropertyForm = ({ property = null }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    latitude: '',
    longitude: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    yearBuilt: '',
    propertyType: 'HOUSE',
    status: 'ACTIVE',
    features: [],
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (property) {
      setFormData({
        ...property,
        images: property.images || [],
      });
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error cuando el usuario modifica el campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'El título es obligatorio';
    if (!formData.description) newErrors.description = 'La descripción es obligatoria';
    if (!formData.price) newErrors.price = 'El precio es obligatorio';
    if (!formData.address) newErrors.address = 'La dirección es obligatoria';
    if (!formData.city) newErrors.city = 'La ciudad es obligatoria';
    if (!formData.state) newErrors.state = 'La provincia/estado es obligatorio';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSubmit = new FormData();

    // Añadir datos de texto
    Object.keys(formData).forEach((key) => {
      if (key !== 'images' && key !== 'features') {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    // Añadir características
    formData.features.forEach((feature) => {
      formDataToSubmit.append('features[]', feature);
    });

    // Añadir imágenes
    imageFiles.forEach((file) => {
      formDataToSubmit.append('images', file);
    });

    try {
      if (property) {
        await dispatch(updateProperty({ id: property.id, propertyData: formDataToSubmit })).unwrap();
      } else {
        await dispatch(createProperty(formDataToSubmit)).unwrap();
      }
      dispatch(closeModal());
    } catch (error) {
      console.error('Error al guardar la propiedad:', error);
    }
  };

  return (
    <Dialog open maxWidth="md" fullWidth>
      <DialogTitle>
        {property ? 'Editar Propiedad' : 'Nueva Propiedad'}
      </DialogTitle>
      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Información básica */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Información básica
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Precio"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">S/.</InputAdornment>,
                }}
                error={!!errors.price}
                helperText={errors.price}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.propertyType}>
                <InputLabel>Tipo de propiedad</InputLabel>
                <Select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  label="Tipo de propiedad"
                >
                  {propertyTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Ubicación */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Ubicación
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ciudad"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Provincia/Estado"
                name="state"
                value={formData.state}
                onChange={handleChange}
                error={!!errors.state}
                helperText={errors.state}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Código postal"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="País"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Grid>

            {/* Características */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Características
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Habitaciones"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Baños"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Superficie (m²)"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Comodidades
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {features.map((feature) => (
                  <Chip
                    key={feature}
                    label={feature}
                    onClick={() => handleFeatureToggle(feature)}
                    color={formData.features.includes(feature) ? 'primary' : 'default'}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Imágenes */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Imágenes
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                multiple
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                >
                  Subir imágenes
                </Button>
              </label>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <AnimatePresence>
                  {imageFiles.map((file, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Box
                          sx={{
                            position: 'relative',
                            paddingTop: '75%',
                            width: '100%',
                            bgcolor: 'grey.100',
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            component="img"
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'background.paper',
                            }}
                            onClick={() => handleRemoveImage(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </motion.div>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(closeModal())}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          {property ? 'Guardar cambios' : 'Crear propiedad'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PropertyForm; 