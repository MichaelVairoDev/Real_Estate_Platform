import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import favoriteService from '../../services/favoriteService';

const initialState = {
  favorites: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Obtener favoritos del usuario
export const getFavorites = createAsyncThunk(
  'favorites/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await favoriteService.getFavorites(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Añadir a favoritos
export const addToFavorites = createAsyncThunk(
  'favorites/add',
  async (propertyId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await favoriteService.addToFavorites(propertyId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Eliminar de favoritos
export const removeFromFavorites = createAsyncThunk(
  'favorites/remove',
  async (propertyId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await favoriteService.removeFromFavorites(propertyId, token);
      return propertyId;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Favorites
      .addCase(getFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.favorites = action.payload;
      })
      .addCase(getFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Add to Favorites
      .addCase(addToFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // La propiedad se añadirá cuando se vuelvan a cargar los favoritos
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Remove from Favorites
      .addCase(removeFromFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.favorites = state.favorites.filter(
          (property) => property.id !== action.payload
        );
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = favoriteSlice.actions;
export default favoriteSlice.reducer;