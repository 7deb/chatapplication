import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingin: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers:[],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/user/check");
      set({ authUser: res.data.user });
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
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      set({ isLoggingin: false });
    }
  },

  logout: async (formData) => {
    try {
      await axiosInstance.post("/user/logout",);
      set({ authUser: null });
      toast.success("Logged out succesfully");
    } catch (error) {
      toast.error("something went wrong");
    }
  },

  updateProfile : async(data) => {
    set({isUpdatingProfile:true});
    try{
      const res = await axiosInstance.put("/user/update-profile",data);
      set({authUser:res.data});
      toast.success("profile updated successfully");
    }catch(error){
      console.error("profile update failed",error);
      toast.error("profile update failed");
    }finally{
      set({isUpdatingProfile:false});
    }
  }
  
}));
