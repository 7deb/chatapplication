import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
  selectedUser: null,
  users: [],
  messages: [],
  isUserLoading: false,
  isMessagesLoading: false,
  error: null,

  setSelectedUser: (user) => set({ selectedUser: user }),

  getUser: async () => {
    set({ isUserLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/message/users');
      set({ users: response.data.filteredUser, isUserLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to fetch users',
        isUserLoading: false,
      });
      toast.error(error.response?.data?.error || 'Failed to fetch users');
    }
  },

  getMessages: async (receiverId) => {
    if (!receiverId) return;
    
    set({ isMessagesLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/message/${receiverId}`);
      set({ messages: response.data, isMessagesLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to fetch messages',
        isMessagesLoading: false,
      });
      toast.error(error.response?.data?.error || 'Failed to fetch messages');
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    if (!selectedUser) {
      toast.error('No user selected');
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      
      // Update messages with the new one
      set((state) => ({
        messages: [...state.messages, response.data],
      }));
      
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send message');
      throw error;
    }
  },
}));