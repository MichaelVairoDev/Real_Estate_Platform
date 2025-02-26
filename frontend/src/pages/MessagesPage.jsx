import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import {
  getUserMessages,
  getAgentMessages,
  sendMessage,
  replyToMessage,
} from '../features/messages/messageSlice';
import { setNotification } from '../features/ui/uiSlice';

const MessagesPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { messages, isLoading } = useSelector((state) => state.messages);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    if (user?.role === 'AGENT') {
      dispatch(getAgentMessages());
    } else {
      dispatch(getUserMessages());
    }
  }, [dispatch, user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedMessage(null);
    setReplyContent('');
  };

  const handleMessageSelect = (message) => {
    setSelectedMessage(message);
    setReplyContent('');
  };

  const handleReply = (e) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      dispatch(
        setNotification({
          message: 'El mensaje no puede estar vacío',
          type: 'error',
        })
      );
      return;
    }

    dispatch(
      replyToMessage({
        messageId: selectedMessage.id,
        content: replyContent,
      })
    );
    setReplyContent('');
  };

  const formatDate = (date) => {
    return format(new Date(date), "d 'de' MMMM 'de' yyyy, HH:mm", {
      locale: es,
    });
  };

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
        Mensajes
      </Typography>

      {user?.role === 'AGENT' && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Recibidos" />
            <Tab label="Enviados" />
          </Tabs>
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '70vh', overflow: 'auto' }}>
            <List>
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <React.Fragment key={message.id}>
                    <ListItem
                      button
                      selected={selectedMessage?.id === message.id}
                      onClick={() => handleMessageSelect(message)}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {message.property ? (
                            <HomeIcon />
                          ) : (
                            <PersonIcon />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          message.property
                            ? message.property.title
                            : message.sender.name
                        }
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
                          </>
                        }
                      />
                    </ListItem>
                    {index < messages.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary="No hay mensajes"
                    secondary="Los mensajes aparecerán aquí"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedMessage ? (
            <Paper sx={{ height: '70vh', p: 3, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedMessage.property
                    ? selectedMessage.property.title
                    : `Conversación con ${selectedMessage.sender.name}`}
                </Typography>
                {selectedMessage.property && (
                  <Typography variant="body2" color="text.secondary">
                    {selectedMessage.property.address},{' '}
                    {selectedMessage.property.city}
                  </Typography>
                )}
              </Box>

              <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar sx={{ mr: 2 }}>
                      {selectedMessage.sender.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {selectedMessage.sender.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(selectedMessage.createdAt)}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ mt: 1, whiteSpace: 'pre-wrap' }}
                      >
                        {selectedMessage.content}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>

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