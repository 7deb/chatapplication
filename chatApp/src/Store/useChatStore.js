import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isMessagesLoading: false,
  isUserLoading: false,

  getUser: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get('/message/users');
      set({ users: res.data.filteredUser || [] });
    } catch (error) {
      console.error("Get users error:", error);
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      const messages = Array.isArray(res.data) ? res.data : [];
      
      const normalizedMessages = messages.map(msg => ({
        ...msg,
        _id: msg._id || Math.random().toString(36).substr(2, 9),
        text: msg.text || msg.message || '',
        createdAt: msg.createdAt || new Date().toISOString()
      }));

      set({ messages: normalizedMessages });
    } catch (error) {
      console.error('Message fetch error:', error.message);
      toast.error(error.response?.data?.message || "Failed to load messages");
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (data) => {
    const { selectedUser, messages } = useChatStore.getState();
    if (!selectedUser) {
      toast.error("Please select a user to chat with.");
      return;
    }

    if (!data.text && !data.image) {
      toast.error("Message cannot be empty");
      return;
    }

    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, data);
      const newMessage = {
        ...res.data,
        text: res.data.text || res.data.message || '',
        _id: res.data._id || Math.random().toString(36).substr(2, 9)
      };
      set({ messages: [...messages, newMessage] });
    } catch (error) {
      console.error('Send message error:', error);
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));