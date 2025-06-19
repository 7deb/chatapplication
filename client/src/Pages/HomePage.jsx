import React from 'react';
import { useChatStore } from '../Store/useChatStore';
import Sidebar from '../Components/Sidebar';
import NoChatSelected from '../Components/Nochatselected';
import ChatContainer from '../Components/ChatContainer';

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-5 px-3">
        <div className="bg-base-100 rounded-lg shadow w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {selectedUser ? <ChatContainer /> : <NoChatSelected />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
