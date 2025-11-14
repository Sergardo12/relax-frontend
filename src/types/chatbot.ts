// types/chatbot.ts

export interface ChatbotMessageDto {
  mensaje: string;
}

export interface ChatbotResponse {
  respuesta: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}