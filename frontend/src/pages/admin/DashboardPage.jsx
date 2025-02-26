import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  Favorite as FavoriteIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalProperties: 156,
    activeProperties: 89,
    totalUsers: 234,
    totalMessages: 567,
    propertiesStats: [
      { month: 'Ene', ventas: 4, alquileres: 6 },
      { month: 'Feb', ventas: 6, alquileres: 8 },
      { month: 'Mar', ventas: 8, alquileres: 7 },
      { month: 'Abr', ventas: 5, alquileres: 9 },
      { month: 'May', ventas: 7, alquileres: 5 },
      { month: 'Jun', ventas: 9, alquileres: 8 },
    ],
  });

  const StatCard = ({ title, value, icon, color, trend, percentage }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" gutterBottom>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {trend === 'up' ? (
            <TrendingUpIcon color="success" />
          ) : (
            <TrendingDownIcon color="error" />
          )}
          <Typography
            variant="body2"
            color={trend === 'up' ? 'success.main' : 'error.main'}
            sx={{ ml: 1 }}
          >
            {percentage}%
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            vs mes anterior
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      {/* Estadísticas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Propiedades"
            value={stats.totalProperties}
            icon={<HomeIcon />}
            color="primary"
            trend="up"
            percentage={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Usuarios"
            value={stats.totalUsers}
            icon={<PersonIcon />}
            color="success"
            trend="up"
            percentage={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Mensajes"
            value={stats.totalMessages}
            icon={<MessageIcon />}
            color="warning"
            trend="down"
            percentage={5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Propiedades activas"
            value={stats.activeProperties}
            icon={<FavoriteIcon />}
            color="error"
            trend="up"
            percentage={15}
          />
        </Grid>
      </Grid>

      {/* Gráfico de propiedades */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Propiedades por mes</Typography>
              <Tooltip title="Estadísticas de ventas y alquileres">
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.propertiesStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="ventas" name="Ventas" fill="#2196f3" />
                <Bar dataKey="alquileres" name="Alquileres" fill="#f50057" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Actividad reciente */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Actividad reciente
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Nuevas propiedades
              </Typography>
              <LinearProgress
                variant="determinate"
                value={70}
                sx={{ mb: 2, height: 8, borderRadius: 4 }}
              />

              <Typography variant="subtitle2" gutterBottom>
                Mensajes respondidos
              </Typography>
              <LinearProgress
                variant="determinate"
                value={85}
                sx={{ mb: 2, height: 8, borderRadius: 4 }}
              />

              <Typography variant="subtitle2" gutterBottom>
                Usuarios activos
              </Typography>
              <LinearProgress
                variant="determinate"
                value={60}
                sx={{ mb: 2, height: 8, borderRadius: 4 }}
              />

              <Typography variant="subtitle2" gutterBottom>
                Visitas a propiedades
              </Typography>
              <LinearProgress
                variant="determinate"
                value={90}
                sx={{ mb: 2, height: 8, borderRadius: 4 }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage; 