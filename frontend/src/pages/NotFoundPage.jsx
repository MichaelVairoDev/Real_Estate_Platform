import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: '6rem', sm: '8rem' },
            fontWeight: 700,
            color: 'primary.main',
            mb: 2,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 500 }}
        >
          Página no encontrada
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}
        >
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
          Por favor, verifica la URL o regresa a la página principal.
        </Typography>

        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
        >
          Volver al inicio
        </Button>

        <Box
          component="img"
          src="/images/404-illustration.svg"
          alt="404 Illustration"
          sx={{
            width: '100%',
            maxWidth: 400,
            height: 'auto',
            mt: 4,
            opacity: 0.8,
          }}
        />
      </Paper>
    </Container>
  );
};

export default NotFoundPage; 