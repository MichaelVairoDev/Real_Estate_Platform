import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messageService from '../../services/messageService';

const initialState = {
  messages: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Obtener mensajes del usuario
export const getUserMessages = createAsyncThunk(
  'messages/getUserMessages',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await messageService.getUserMessages(token);
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

// Obtener mensajes del agente
export const getAgentMessages = createAsyncThunk(
  'messages/getAgentMessages',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await messageService.getAgentMessages(token);
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

// Enviar mensaje
export const sendMessage = createAsyncThunk(
  'messages/send',
  async ({ propertyId, agentId, content }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await messageService.sendMessage(propertyId, agentId, content, token);
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

// Responder a un mensaje
export const replyToMessage = createAsyncThunk(
  'messages/reply',
  async ({ messageId, content }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await messageService.replyToMessage(messageId, content, token);
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

export const messageSlice = createSlice({
  name: 'messages',
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
      // Get User Messages
      .addCase(getUserMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.messages = action.payload;
      })
      .addCase(getUserMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Agent Messages
      .addCase(getAgentMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAgentMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.messages = action.payload;
      })
      .addCase(getAgentMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.messages.unshift(action.payload.data);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Reply to Message
      .addCase(replyToMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(replyToMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.messages.unshift(action.payload.data);
      })
      .addCase(replyToMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = messageSlice.actions;
export default messageSlice.reducer; 