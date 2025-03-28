import {create} from "zustand";
import { useAuthStore } from "./useAuthStore";
import {axiosInstance} from "../lib/axios";


export const useChatStore = create((set,get) =>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers: async () => {
        set({isUsersLoading:true});
        try {
            const res = await axiosInstance.get("/messages/users");
            set({users:res.data});
        } catch (error) {
            
        } finally{
            set({isUsersLoading:false})
        }
        
    },


    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
          const res = await axiosInstance.get(`/messages/${userId}`);
          set({ messages: res.data });
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isMessagesLoading: false });
        }
      },  



      sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
          set({ messages: [...messages, res.data] });
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
      

      subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
    
        const socket = useAuthStore.getState().socket;
    
        if (!socket) {
            console.error("Socket is not connected yet! Cannot subscribe to messages.");
            return;
        }
    
        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
    
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },
    


    
    
      
      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
      },
      

      setSelectedUser: (selectedUser) => set({ selectedUser }), 
}))
