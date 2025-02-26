import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Grid,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';

const UsersPage = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: '',
  });

  // Datos de ejemplo (reemplazar con datos reales de Redux)
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'USER',
      status: 'ACTIVE',
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria@example.com',
      role: 'AGENT',
      status: 'ACTIVE',
      createdAt: '2024-01-16',
    },
    {
      id: 3,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: '2024-01-17',
    },
  ]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (user = null) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setOpenDialog(false);
  };

  const handleDelete = (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      // Implementar eliminación
      console.log('Eliminar usuario:', userId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementar guardado
    handleCloseDialog();
  };

  const getRoleChip = (role) => {
    const roleConfig = {
      ADMIN: { label: 'Administrador', color: 'error' },
      AGENT: { label: 'Agente', color: 'primary' },
      USER: { label: 'Usuario', color: 'default' },
    };

    const config = roleConfig[role] || { label: role, color: 'default' };

    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getStatusChip = (status) => {
    return (
      <Chip
        label={status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
        color={status === 'ACTIVE' ? 'success' : 'default'}
        size="small"
      />
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Gestión de Usuarios
        </Typography>
      </Box>

      {/* Filtros y búsqueda */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Buscar usuarios..."
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
              <InputLabel>Rol</InputLabel>
              <Select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                label="Rol"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="ADMIN">Administrador</MenuItem>
                <MenuItem value="AGENT">Agente</MenuItem>
                <MenuItem value="USER">Usuario</MenuItem>
              </Select>
            </FormControl>
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
                <MenuItem value="ACTIVE">Activo</MenuItem>
                <MenuItem value="INACTIVE">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterListIcon />}
            >
              Filtrar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de usuarios */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha registro</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2 }}>{user.name.charAt(0)}</Avatar>
                      <Typography>{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleChip(user.role)}</TableCell>
                  <TableCell>{getStatusChip(user.status)}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(user.id)}
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
          count={users.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
        />
      </TableContainer>

      {/* Diálogo de edición */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="name"
                  defaultValue={selectedUser?.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  defaultValue={selectedUser?.email}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    name="role"
                    defaultValue={selectedUser?.role || 'USER'}
                    label="Rol"
                  >
                    <MenuItem value="ADMIN">Administrador</MenuItem>
                    <MenuItem value="AGENT">Agente</MenuItem>
                    <MenuItem value="USER">Usuario</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="status"
                    defaultValue={selectedUser?.status || 'ACTIVE'}
                    label="Estado"
                  >
                    <MenuItem value="ACTIVE">Activo</MenuItem>
                    <MenuItem value="INACTIVE">Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UsersPage; 