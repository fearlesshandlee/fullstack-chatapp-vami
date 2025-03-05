import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [chattedUsers, setChattedUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    if (!users || users.length === 0) return;
    
    const query = searchQuery.startsWith("@") ? searchQuery : `@${searchQuery}`;
    const foundUser = users.find((user) => user?.userName?.toLowerCase() === query.toLowerCase());
    
    console.log("Found User:", foundUser);
    setSearchedUser(foundUser || null);
  };

  const handleSendMessage = (user) => {
    if (!chattedUsers.some((u) => u._id === user._id)) {
      setChattedUsers((prev) => [...prev, user]);
    }
    setSelectedUser(user);
  };

  const handleRemoveUser = (userId) => {
    setChattedUsers((prev) => prev.filter((user) => user._id !== userId));
  };
  

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header Section */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* User Search Bar */}
        <form
  className="flex items-center gap-2 py-1"
  onSubmit={(e) => {
    e.preventDefault(); // Prevents page reload
    handleSearch();
  }}
>
  <label className="border border-gray-400 flex w-full rounded-lg overflow-hidden">
    <input
      type="text"
      className="flex-grow p-2 outline-none"
      placeholder="Find User..?"
      value={searchQuery}
      onChange={(e) => {
        const input = e.target.value;
        setSearchQuery(input.startsWith("@") ? input : `@${input}`);
      }}
    />
    <button type="submit" className="p-2">
      <svg
        className="h-[1em] opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2.5"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>
    </button>
  </label>
</form>

      </div>

      {/* Chatted Users Section */}
      <div className="overflow-y-auto w-full py-3">
        {chattedUsers.length > 0 && <div className="text-sm text-gray-500 px-4 pb-2">Recent Chats</div>}
        {chattedUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.userName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">{user.userName}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Searched User Section */}
      {searchedUser && !chattedUsers.some((u) => u._id === searchedUser._id) && (
        <div className="overflow-y-auto w-full py-3">
          <button
            key={searchedUser._id}
            onClick={() => handleSendMessage(searchedUser)}
            className={`w-full  flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === searchedUser._id ? "bg-base-300 ring-1 ring-base-300" : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={searchedUser.profilePic || "/avatar.png"}
                alt={searchedUser.userName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(searchedUser._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{searchedUser.fullName}</div>
              <div className="text-sm text-zinc-400">{searchedUser.userName}</div>
            </div>
            
          </button>


        </div>
      )}

      {searchQuery && !searchedUser && <div className="text-center text-zinc-500 py-4">No user found</div>}
    </aside>
  );
};

export default Sidebar;
