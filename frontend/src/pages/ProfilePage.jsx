import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Tab,
  Tabs,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

import { updateProfile, updatePassword } from '../features/auth/authSlice';
import { setNotification } from '../features/ui/uiSlice';
import PropertyCard from '../components/property/PropertyCard';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      dispatch(
        setNotification({
          message: 'El nombre y el email son obligatorios',
          type: 'error',
        })
      );
      return;
    }

    dispatch(updateProfile(formData));
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      dispatch(
        setNotification({
          message: 'Todos los campos son obligatorios',
          type: 'error',
        })
      );
      return;
    }

    if (passwordData.newPassword.length < 6) {
      dispatch(
        setNotification({
          message: 'La nueva contraseña debe tener al menos 6 caracteres',
          type: 'error',
        })
      );
      return;
    }

    dispatch(updatePassword(passwordData));
    setShowPasswordDialog(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Perfil del usuario */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>

            <Typography variant="h5" gutterBottom>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user?.role === 'AGENT' ? 'Agente inmobiliario' : 'Usuario'}
            </Typography>

            <Button
              variant="outlined"
              onClick={() => setShowPasswordDialog(true)}
              sx={{ mt: 2 }}
            >
              Cambiar contraseña
            </Button>
          </Paper>
        </Grid>

        {/* Información y propiedades */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Información personal" />
                {user?.role === 'AGENT' && <Tab label="Mis propiedades" />}
                <Tab label="Favoritos" />
              </Tabs>
            </Box>

            {/* Información personal */}
            {activeTab === 0 && (
              <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h6">Información personal</Typography>
                  {!isEditing ? (
                    <IconButton
                      color="primary"
                      onClick={() => setIsEditing(true)}
                    >
                      <EditIcon />
                    </IconButton>
                  ) : (
                    <Box>
                      <IconButton
                        color="primary"
                        type="submit"
                        disabled={isLoading}
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: user.name,
                            email: user.email,
                            phone: user.phone || '',
                          });
                        }}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Nombre completo"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Correo electrónico"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Teléfono"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            )}

            {/* Propiedades del agente */}
            {activeTab === 1 && user?.role === 'AGENT' && (
              <Box sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h6">Mis propiedades</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      // Implementar navegación a crear propiedad
                    }}
                  >
                    Añadir propiedad
                  </Button>
                </Box>

                {user?.properties?.length > 0 ? (
                  <Grid container spacing={3}>
                    {user.properties.map((property) => (
                      <Grid item xs={12} sm={6} key={property.id}>
                        <PropertyCard property={property} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body1" color="text.secondary" align="center">
                    No tienes propiedades publicadas
                  </Typography>
                )}
              </Box>
            )}

            {/* Favoritos */}
            {activeTab === (user?.role === 'AGENT' ? 2 : 1) && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Propiedades favoritas
                </Typography>

                {user?.favorites?.length > 0 ? (
                  <Grid container spacing={3}>
                    {user.favorites.map((property) => (
                      <Grid item xs={12} sm={6} key={property.id}>
                        <PropertyCard property={property} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body1" color="text.secondary" align="center">
                    No tienes propiedades favoritas
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Diálogo de cambio de contraseña */}
      <Dialog
        open={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
      >
        <DialogTitle>Cambiar contraseña</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handlePasswordSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="currentPassword"
              label="Contraseña actual"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="Nueva contraseña"
              type={showNewPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancelar</Button>
          <Button
            onClick={handlePasswordSubmit}
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Guardar'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
