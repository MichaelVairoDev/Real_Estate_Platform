import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import HomeIcon from '@mui/icons-material/Home';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MessageIcon from '@mui/icons-material/Message';
import Badge from '@mui/material/Badge';

import { logout } from '../../features/auth/authSlice';
import { toggleDarkMode } from '../../features/ui/uiSlice';

const pages = [
  { title: 'Inicio', path: '/' },
  { title: 'Propiedades', path: '/properties' },
];

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.ui);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    handleCloseUserMenu();
  };

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo para pantallas grandes */}
          <HomeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Poppins',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            INMOBILIARIA
          </Typography>

          {/* Menú móvil */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu de navegación"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.title} 
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={page.path}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo para móviles */}
          <HomeIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Poppins',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            INMOBILIARIA
          </Typography>

          {/* Menú de navegación para pantallas grandes */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* Botón de modo oscuro */}
          <Box sx={{ mr: 2 }}>
            <IconButton color="inherit" onClick={handleToggleDarkMode}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>

          {/* Menú de usuario */}
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                {/* Iconos de acciones rápidas */}
                <Box sx={{ display: { xs: 'none', md: 'inline-flex' }, mr: 2 }}>
                  <IconButton 
                    color="inherit" 
                    component={RouterLink} 
                    to="/favorites"
                    sx={{ mr: 1 }}
                  >
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton 
                    color="inherit" 
                    component={RouterLink} 
                    to="/messages"
                  >
                    <Badge badgeContent={0} color="error">
                      <MessageIcon />
                    </Badge>
                  </IconButton>
                </Box>
                
                {/* Avatar y menú de usuario */}
                <Tooltip title="Abrir opciones">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.name} src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem 
                    onClick={handleCloseUserMenu}
                    component={RouterLink}
                    to="/profile"
                  >
                    <Typography textAlign="center">Perfil</Typography>
                  </MenuItem>
                  
                  <MenuItem 
                    onClick={handleCloseUserMenu}
                    component={RouterLink}
                    to="/favorites"
                    sx={{ display: { md: 'none' } }}
                  >
                    <Typography textAlign="center">Favoritos</Typography>
                  </MenuItem>
                  
                  <MenuItem 
                    onClick={handleCloseUserMenu}
                    component={RouterLink}
                    to="/messages"
                    sx={{ display: { md: 'none' } }}
                  >
                    <Typography textAlign="center">Mensajes</Typography>
                  </MenuItem>
                  
                  {user.role === 'ADMIN' && (
                    <MenuItem 
                      onClick={handleCloseUserMenu}
                      component={RouterLink}
                      to="/admin"
                    >
                      <Typography textAlign="center">Administración</Typography>
                    </MenuItem>
                  )}
                  
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Cerrar sesión</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/login"
                  sx={{ mr: 1 }}
                >
                  Iniciar sesión
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  component={RouterLink} 
                  to="/register"
                >
                  Registrarse
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 