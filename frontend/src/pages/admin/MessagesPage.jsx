import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const MessagesPage = () => {
  const dispatch = useDispatch();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
  });

  // Datos de ejemplo (reemplazar con datos reales de Redux)
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: 'Me interesa esta propiedad, ¿podría darme más información?',
      sender: {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@example.com',
      },
      property: {
        id: 1,
        title: 'Apartamento en el centro',
        address: 'Calle Principal 123',
      },
      createdAt: '2024-01-15T10:30:00',
      status: 'PENDING',
    },
    {
      id: 2,
      content: '¿Está disponible para una visita este fin de semana?',
      sender: {
        id: 2,
        name: 'María García',
        email: 'maria@example.com',
      },
      property: {
        id: 2,
        title: 'Casa con jardín',
        address: 'Avenida Central 456',
      },
      createdAt: '2024-01-16T15:45:00',
      status: 'ANSWERED',
    },
  ]);

  const handleMessageSelect = (message) => {
    setSelectedMessage(message);
    setReplyContent('');
  };

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    // Implementar envío de respuesta
    console.log('Enviar respuesta:', {
      messageId: selectedMessage.id,
      content: replyContent,
    });

    setReplyContent('');
  };

  const handleDelete = (messageId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
      // Implementar eliminación
      console.log('Eliminar mensaje:', messageId);
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), "d 'de' MMMM 'de' yyyy, HH:mm", {
      locale: es,
    });
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      PENDING: { label: 'Pendiente', color: 'warning' },
      ANSWERED: { label: 'Respondido', color: 'success' },
      ARCHIVED: { label: 'Archivado', color: 'default' },
    };

    const config = statusConfig[status] || { label: status, color: 'default' };

    return <Chip label={config.label} color={config.color} size="small" />;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Gestión de Mensajes
        </Typography>
      </Box>

      {/* Filtros y búsqueda */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              placeholder="Buscar mensajes..."
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
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                label="Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="PENDING">Pendientes</MenuItem>
                <MenuItem value="ANSWERED">Respondidos</MenuItem>
                <MenuItem value="ARCHIVED">Archivados</MenuItem>
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

      <Grid container spacing={3}>
        {/* Lista de mensajes */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '70vh', overflow: 'auto' }}>
            <List>
              {messages.map((message, index) => (
                <React.Fragment key={message.id}>
                  <ListItem
                    button
                    selected={selectedMessage?.id === message.id}
                    onClick={() => handleMessageSelect(message)}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={message.sender.name}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            noWrap
                          >
                            {message.content.substring(0, 50)}
                            {message.content.length > 50 ? '...' : ''}
                          </Typography>
                          <br />
                          {formatDate(message.createdAt)}
                          <br />
                          {getStatusChip(message.status)}
                        </>
                      }
                    />
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(message.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                  {index < messages.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Detalle del mensaje */}
        <Grid item xs={12} md={8}>
          {selectedMessage ? (
            <Paper sx={{ height: '70vh', p: 3, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {selectedMessage.sender.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedMessage.sender.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HomeIcon sx={{ mr: 1 }} color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {selectedMessage.property.title} - {selectedMessage.property.address}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {formatDate(selectedMessage.createdAt)}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                {selectedMessage.content}
              </Typography>

              <Box sx={{ mt: 'auto' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Responder
                </Typography>
                <Box component="form" onSubmit={handleReply}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Escribe tu respuesta..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={<SendIcon />}
                    disabled={!replyContent.trim()}
                  >
                    Enviar respuesta
                  </Button>
                </Box>
              </Box>
            </Paper>
          ) : (
            <Paper
              sx={{
                height: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Selecciona un mensaje para ver los detalles
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MessagesPage; 