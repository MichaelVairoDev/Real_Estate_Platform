import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  InputAdornment,
  IconButton,
  CircularProgress,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';

import { register, reset } from '../features/auth/authSlice';
import { setNotification } from '../features/ui/uiSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'USER',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { name, email, password, confirmPassword, phone, role } = formData;

  useEffect(() => {
    if (isError) {
      dispatch(
        setNotification({
          message,
          type: 'error',
        })
      );
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      dispatch(
        setNotification({
          message: 'Por favor, completa todos los campos obligatorios',
          type: 'error',
        })
      );
      return;
    }

    if (password !== confirmPassword) {
      dispatch(
        setNotification({
          message: 'Las contraseñas no coinciden',
          type: 'error',
        })
      );
      return;
    }

    if (password.length < 6) {
      dispatch(
        setNotification({
          message: 'La contraseña debe tener al menos 6 caracteres',
          type: 'error',
        })
      );
      return;
    }

    const userData = {
      name,
      email,
      password,
      phone,
      role,
    };

    dispatch(register(userData));
  };

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Crear cuenta
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Regístrate para acceder a todas las funcionalidades
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nombre completo"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            value={email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
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
            name="confirmPassword"
            label="Confirmar contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            fullWidth
            id="phone"
            label="Teléfono"
            name="phone"
            autoComplete="tel"
            value={phone}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth margin="normal">
            <Select
              id="role"
              name="role"
              value={role}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="USER">Usuario</MenuItem>
              <MenuItem value="AGENT">Agente inmobiliario</MenuItem>
            </Select>
            <FormHelperText>
              Selecciona tu rol en la plataforma
            </FormHelperText>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Crear cuenta'
            )}
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              ¿Ya tienes una cuenta?
            </Typography>
          </Divider>

          <Button
            component={RouterLink}
            to="/login"
            fullWidth
            variant="outlined"
            size="large"
          >
            Iniciar sesión
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage; 