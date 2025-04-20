import { useChatStore } from "../Store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../Store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!authUser) {
      console.error("No authenticated user detected!");
      return;
    }
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser?._id, getMessages, authUser]);

  useEffect(() => {
    if (messageEndRef.current && messages?.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.length > 0 ? (
          messages.map((message, index) => {
            const messageContent = message.text || message.message || '';
            const isCurrentUser = message.senderId === authUser?._id;
            
            return (
              <div
                key={message._id || index}
                className={`chat ${isCurrentUser ? "chat-end" : "chat-start"}`}
                ref={index === messages.length - 1 ? messageEndRef : null}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        isCurrentUser
                          ? authUser?.profilePic || "/avatar.png"
                          : selectedUser?.profilePic || "/avatar.png"
                      }
                      alt="profile"
                      onError={(e) => {
                        e.target.src = "/avatar.png";
                      }}
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                <div className={`chat-bubble flex flex-col ${
                  isCurrentUser ? "bg-blue-600" : "bg-gray-600"
                } text-white`}>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  {messageContent ? (
                    <p>{messageContent}</p>
                  ) : (
                    <span className="italic text-gray-300">[No message]</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet</p>
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;