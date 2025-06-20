import React, { useEffect, useState } from 'react';
import { useChatStore } from '../Store/useChatStore';
import SidebarSkeleton from './Skeletons/SidebarSkeleton';
import { Users } from 'lucide-react';
import { useAuthStore } from '../Store/useAuthStore';

const Sidebar = () => {
  const { getUser, users, selectedUser, setSelectedUser, isUserLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUser();
  }, []);

  if (isUserLoading) return <SidebarSkeleton />;

  // ✅ Sort users by the most recent message timestamp
  const sortedUsers = [...users].sort((a, b) => {
    const timeA = new Date(a.lastMessage?.createdAt || 0);
    const timeB = new Date(b.lastMessage?.createdAt || 0);
    return timeB - timeA;
  });

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="sticky top-0 z-30 border-b p-5 bg-base-100 border-base-300">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {sortedUsers.map(user => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''}
            `}
          >
            {/* Avatar + Online Dot */}
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || '/avatar.png'}
                alt={user.username}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            {/* Username + Last Message */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.username}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
              </div>
              {user.lastMessage?.text && (
                <div className="text-xs text-zinc-500 truncate mt-1">
                  {user.lastMessage.text}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
