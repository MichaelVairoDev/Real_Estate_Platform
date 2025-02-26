import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notification: {
    open: false,
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
  },
  modal: {
    open: false,
    type: null, // 'login', 'register', 'contact', 'property-form', etc.
    data: null,
  },
  loading: false,
  searchDrawerOpen: false,
  mobileMenuOpen: false,
  darkMode: localStorage.getItem('darkMode') === 'true',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.notification = {
        open: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
      };
    },
    clearNotification: (state) => {
      state.notification.open = false;
    },
    openModal: (state, action) => {
      state.modal = {
        open: true,
        type: action.payload.type,
        data: action.payload.data || null,
      };
    },
    closeModal: (state) => {
      state.modal.open = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    toggleSearchDrawer: (state) => {
      state.searchDrawerOpen = !state.searchDrawerOpen;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
  },
});

export const {
  setNotification,
  clearNotification,
  openModal,
  closeModal,
  setLoading,
  toggleSearchDrawer,
  toggleMobileMenu,
  toggleDarkMode,
} = uiSlice.actions;

export default uiSlice.reducer; 