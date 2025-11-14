import apiClient from '@/lib/api/client';
import { ChatbotMessageDto, ChatbotResponse } from '@/types';

export const chatbotService = {
  // POST /chatbot/ask
  ask: async (dto: ChatbotMessageDto): Promise<ChatbotResponse> => {
    const { data } = await apiClient.post<ChatbotResponse>('/chatbot/ask', dto);
    return data;
  },
};