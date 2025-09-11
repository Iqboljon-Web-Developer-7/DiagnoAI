import { useAppStore } from '@/store/store';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const useChat = (id:string) => {
  const { user } = useAppStore();

  const chatQuery = useQuery({
    queryKey: ['chat', id],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/api/chats/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      return response.data;
    },
  });

  const chatMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        `${API_BASE_URL}/api/chats/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    },
  });

  return {
    chat: chatQuery.data,
    isLoading: chatQuery.isLoading,
    isError: chatQuery.isError,
    error: chatQuery.error,
    submitChat: chatMutation.mutate,
    isSubmitting: chatMutation.isPending,
    submitError: chatMutation.error,
  };
};
