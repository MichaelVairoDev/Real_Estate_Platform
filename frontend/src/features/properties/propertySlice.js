import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import propertyService from '../../services/propertyService';

const initialState = {
  properties: [],
  property: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  },
  filters: {
    city: '',
    state: '',
    country: '',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    maxBedrooms: '',
    minBathrooms: '',
    maxBathrooms: '',
    minArea: '',
    maxArea: '',
    propertyType: '',
    status: 'ACTIVE',
    features: []
  }
};

// Obtener todas las propiedades
export const getProperties = createAsyncThunk(
  'properties/getAll',
  async (params, thunkAPI) => {
    try {
      return await propertyService.getProperties(params);
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

// Obtener una propiedad por ID
export const getPropertyById = createAsyncThunk(
  'properties/getById',
  async (id, thunkAPI) => {
    try {
      return await propertyService.getPropertyById(id);
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

// Buscar propiedades
export const searchProperties = createAsyncThunk(
  'properties/search',
  async (searchParams, thunkAPI) => {
    try {
      return await propertyService.searchProperties(searchParams);
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

// Crear una propiedad
export const createProperty = createAsyncThunk(
  'properties/create',
  async (propertyData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await propertyService.createProperty(propertyData, token);
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

// Actualizar una propiedad
export const updateProperty = createAsyncThunk(
  'properties/update',
  async ({ id, propertyData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await propertyService.updateProperty(id, propertyData, token);
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

// Eliminar una propiedad
export const deleteProperty = createAsyncThunk(
  'properties/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await propertyService.deleteProperty(id, token);
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

export const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        city: '',
        state: '',
        country: '',
        minPrice: '',
        maxPrice: '',
        minBedrooms: '',
        maxBedrooms: '',
        minBathrooms: '',
        maxBathrooms: '',
        minArea: '',
        maxArea: '',
        propertyType: '',
        status: 'ACTIVE',
        features: []
      };
    },
    clearProperty: (state) => {
      state.property = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Properties
      .addCase(getProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = action.payload.properties;
        state.pagination = action.payload.pagination;
      })
      .addCase(getProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Property By ID
      .addCase(getPropertyById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPropertyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.property = action.payload;
      })
      .addCase(getPropertyById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Search Properties
      .addCase(searchProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = action.payload.properties;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create Property
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties.unshift(action.payload.property);
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Property
      .addCase(updateProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = state.properties.map((property) =>
          property.id === action.payload.property.id
            ? action.payload.property
            : property
        );
        state.property = action.payload.property;
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete Property
      .addCase(deleteProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = state.properties.filter(
          (property) => property.id !== action.payload.id
        );
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, setFilters, clearFilters, clearProperty } = propertySlice.actions;
export default propertySlice.reducer; 