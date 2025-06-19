import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASEURL = import.meta.env.MODE === "development" ? "http://localhost:4000" : "/";



export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingin: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/user/check");
      set({ authUser: res.data.user });
      get().connectSocket();
    } catch (error) {
      console.log("error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post("/user/signup", formData);
      console.log("🔁 Response from backend on signup:", res.data);

      set({ authUser: res.data });

      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      console.error("Signup failed", error);
      toast.error("Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formData) => {
    try {
      set({ isLoggingin: true });
      const res = await axiosInstance.post("/user/login", formData);
      console.log("🔁 Response from backend on Login:", res.data);

      set({ authUser: res.data });

      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      set({ isLoggingin: false });
    }
  },

  logout: async () => {
  try {
    await axiosInstance.post("/user/logout");
    set({ authUser: null });
    toast.success("Logged out successfully");
    get().disconnectSocket();
  } catch (error) {
    console.error("Logout failed", error); // 👈 This is important
    toast.error("Something went wrong during logout");
  }
},

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/user/update-profile", data);
      set({ authUser: res.data });
      toast.success("profile updated successfully");
    } catch (error) {
      console.error("profile update failed", error);
      toast.error("profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASEURL, {
      query: {
        userId: authUser._id,
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected", socket.id);
      set({ socket });
    });

    socket.on("getOnlineUsers", (onlineUsers) => {
      console.log("👥 Online users:", onlineUsers);
      set({ onlineUsers });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
      console.log("Socket disconnected");
    }
  },

}));