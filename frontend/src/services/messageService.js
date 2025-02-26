import api from './api';

// Obtener mensajes del usuario
const getUserMessages = async () => {
  const response = await api.get('/messages/user');
  return response.data;
};

// Obtener mensajes del agente
const getAgentMessages = async () => {
  const response = await api.get('/messages/agent');
  return response.data;
};

// Enviar mensaje
const sendMessage = async (propertyId, agentId, content) => {
  const response = await api.post(`/messages/${propertyId}/${agentId}`, { content });
  return response.data;
};

// Responder a un mensaje
const replyToMessage = async (messageId, content) => {
  const response = await api.post(`/messages/reply/${messageId}`, { content });
  return response.data;
};

const messageService = {
  getUserMessages,
  getAgentMessages,
  sendMessage,
  replyToMessage,
};

export default messageService; 