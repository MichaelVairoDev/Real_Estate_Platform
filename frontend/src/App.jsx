import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './features/store';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import PropertyListPage from './pages/PropertyListPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import MessagesPage from './pages/MessagesPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminPropertiesPage from './pages/admin/PropertiesPage';
import AdminUsersPage from './pages/admin/UsersPage';
import AdminMessagesPage from './pages/admin/MessagesPage';

// Auth Guard
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="properties" element={<PropertyListPage />} />
              <Route path="properties/:id" element={<PropertyDetailPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="profile" element={<ProfilePage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="messages" element={<MessagesPage />} />
              </Route>
              
              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="properties" element={<AdminPropertiesPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="messages" element={<AdminMessagesPage />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App; 