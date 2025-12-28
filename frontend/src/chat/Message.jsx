import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import {
    connectSocket,
    sendSocketMessage,
    disconnectSocket
} from "../websocket/socket";
import { ArrowLeft, CheckCheck, Loader2, MessageSquare, MoreVertical, Plus, Search, Send, X } from "lucide-react";

export default function useMessageLogic() {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUserModal, setShowUserModal] = useState(false);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [userLoading, setUserLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);

    // ✅ FIX 1: Create a Ref to track active chat without re-triggering effects
    const activeChatRef = useRef(null);
    const messagesEndRef = useRef(null);
    
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    /* =========================
        HELPER: GET SAFE ID
    ========================== */
    const getChatPartnerId = (chat) => {
        if (!chat) return null;
        return String(chat.friendId || chat.friendUserId || "");
    };

    /* =========================
        SYNC REF WITH STATE
    ========================== */
    // ✅ FIX 2: Keep the Ref in sync with state
    useEffect(() => {
        activeChatRef.current = activeChat;
    }, [activeChat]);

    /* =========================
        FETCH CHAT LIST
    ========================== */
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await api.get("/users/me/chats");
                setChats(res.data);
            } catch (err) {
                console.error("Failed to fetch chats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchChats();
    }, []);

    /* =========================
        HANDLE URL QUERY PARAM
    ========================== */
    useEffect(() => {
        if (!loading) {
            const userIdFromUrl = searchParams.get("user");
            if (userIdFromUrl && getChatPartnerId(activeChat || {}) !== userIdFromUrl) {
                const existingChat = chats.find(c => getChatPartnerId(c) === userIdFromUrl);
                if (existingChat) {
                    setSelectChat(existingChat);
                } else {
                    const fetchUserAndStart = async () => {
                        try {
                            const res = await api.get(`/users/${userIdFromUrl}`);
                            if (res.data) startChat(res.data);
                        } catch (err) {
                            console.error("Could not fetch user from URL", err);
                        }
                    };
                    fetchUserAndStart();
                }
            }
        }
    }, [loading, chats.length, searchParams]);

    /* =========================
        CONNECT WEBSOCKET (FIXED)
    ========================== */
    useEffect(() => {
        const myUserId = localStorage.getItem("userId");

        // ✅ FIX 3: Removed [activeChat] dependency. Socket connects ONCE.
        connectSocket(myUserId, async (incomingMessage) => {
            if (incomingMessage.senderId === myUserId) return;

            // Use REF to get the current open chat instantly
            const currentActiveChat = activeChatRef.current;
            const currentActiveId = getChatPartnerId(currentActiveChat);
            const senderId = String(incomingMessage.senderId);

            // Is the user currently looking at this chat?
            const isOpen = currentActiveId === senderId;

            // 1. Update Active Chat Messages
            setMessages(prev => {
                if (isOpen) {
                    return [...prev, incomingMessage];
                }
                return prev;
            });

            // 2. If open, mark read on server immediately (Real-time sync)
            if (isOpen && currentActiveChat?.conversationId) {
                try {
                    api.post(`/users/me/chats/${currentActiveChat.conversationId}/read`);
                } catch (e) { console.error("Read receipt failed", e); }
            }

            // 3. Update Sidebar (Last Message + Unread Count)
            setChats(prev =>
                prev.map(chat => {
                    const chatPartnerId = getChatPartnerId(chat);

                    if (chatPartnerId === senderId) {
                        return {
                            ...chat,
                            lastMessage: incomingMessage.content,
                            lastUpdated: new Date().toISOString(),
                            // ✅ FIX 4: Logic is now based on the Ref, which is always up to date
                            unreadCount: isOpen ? 0 : (chat.unreadCount || 0) + 1
                        };
                    }
                    return chat;
                })
            );
        });

        return () => disconnectSocket();
    }, []); // Empty dependency array = Stable connection

    /* =========================
        AUTO SCROLL
    ========================== */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, activeChat]);

    /* =========================
        OPEN USER MODAL
    ========================== */
    const openNewChatModal = async () => {
        setShowUserModal(true);
        setUserLoading(true);
        try {
            const res = await api.get("/users");
            setAvailableUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setUserLoading(false);
        }
    };

    /* =========================
        START CHAT
    ========================== */
    const startChat = (user) => {
        const targetUserId = user.userId || user._id;
        const existing = chats.find(c => getChatPartnerId(c) === String(targetUserId));

        if (existing) {
            setSelectChat(existing);
        } else {
            const newChat = {
                conversationId: `new-${targetUserId}`,
                friendId: targetUserId,
                displayName: user.displayName,
                profilePhoto: user.profilePhoto,
                isNew: true,
                unreadCount: 0
            };
            setActiveChat(newChat);
            setMessages([]);
        }
        setShowUserModal(false);
    };

    /* =========================
      SELECT CHAT
    ========================== */
    const setSelectChat = async (chat) => {
        const friendId = getChatPartnerId(chat);
        if (!friendId) return;

        // 1. Set Active
        setActiveChat({ ...chat, friendId });

        // 2. Clear Unread Count in Sidebar (Optimistic UI)
        setChats(prev => prev.map(c => {
            if (getChatPartnerId(c) === friendId) {
                return { ...c, unreadCount: 0 };
            }
            return c;
        }));

        // 3. API CALL: Mark read
        if (chat.unreadCount > 0 && chat.conversationId) {
            try {
                await api.post(`/users/me/chats/${chat.conversationId}/read`);
            } catch (err) {
                console.error("Failed to mark messages as read", err);
            }
        }

        fetchMessages(friendId);
    };

    /* =========================
        FETCH MESSAGES
    ========================== */
    const fetchMessages = async (friendUserId) => {
        try {
            setMessagesLoading(true);
            const myUserId = localStorage.getItem("userId");
            const res = await api.get(
                `/users/me/messages/${friendUserId}`,
                { params: { myUserId } }
            );
            setMessages(res.data);
        } catch (err) {
            console.error("Failed to fetch messages", err);
        } finally {
            setMessagesLoading(false);
        }
    };

    /* =========================
        SEND MESSAGE
    ========================== */
    const sendMessage = () => {
        if (!message.trim() || !activeChat?.friendId) return;

        const myUserId = localStorage.getItem("userId");
        const payload = {
            senderId: myUserId,
            receiverId: activeChat.friendId,
            content: message,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, payload]);
        setMessage("");

        // Update sidebar to show my own new message
        setChats(prev =>
            prev.map(chat =>
                getChatPartnerId(chat) === activeChat.friendId
                    ? { ...chat, lastMessage: payload.content, lastUpdated: payload.timestamp }
                    : chat
            )
        );

        sendSocketMessage(payload);
    };

    // ... Return Statement remains the same ...
    return (
        <div className="h-screen bg-[#0f172a] text-slate-50 flex flex-col overflow-hidden font-sans">
            {/* ... Keep your existing JSX ... */}
            {/* GLOBAL HEADER */}
            <header className="px-6 py-4 border-b border-white/5 bg-slate-900/80 backdrop-blur-md flex items-center justify-between z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Messages</h1>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Active Workspace</p>
                    </div>
                </div>
                <button
                    onClick={openNewChatModal}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                    <Plus size={18} /> New Chat
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* CHAT LIST (ASIDE) */}
                <aside className="w-80 border-r border-white/5 bg-slate-900/40 flex flex-col hidden md:flex">
                    <div className="p-5 shrink-0">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                            <input
                                placeholder="Search conversations..."
                                className="w-full bg-slate-800/50 border border-slate-700/50 focus:border-indigo-500 outline-none rounded-xl py-2.5 pl-10 text-xs transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-2">
                        {chats.length === 0 ? (
                            <p className="text-center text-slate-600 text-xs mt-10 italic">No recent chats</p>
                        ) : (
                            chats.map(chat => (
                                <div
                                    key={chat.conversationId}
                                    onClick={() => setSelectChat(chat)}
                                    className={`group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border relative overflow-hidden ${(activeChat?.conversationId === chat.conversationId) || (activeChat?.friendId && activeChat.friendId === getChatPartnerId(chat))
                                            ? "bg-indigo-600/10 border-indigo-500/20 shadow-md shadow-indigo-900/10"
                                            : "hover:bg-white/5 border-transparent"
                                        }`}
                                >
                                    {/* Active Indicator Bar */}
                                    {activeChat?.friendId === getChatPartnerId(chat) && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-indigo-500 rounded-r-full" />
                                    )}

                                    {/* Avatar Area */}
                                    <div className="relative shrink-0">
                                        <img
                                            src={chat.profilePhoto || `https://ui-avatars.com/api/?name=${chat.displayName}&background=6366f1&color=fff`}
                                            className={`w-12 h-12 rounded-xl object-cover transition-all ${chat.unreadCount > 0 ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#0f172a]" : ""
                                                }`}
                                            alt=""
                                        />
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-[3px] border-[#0f172a] rounded-full" />
                                    </div>

                                    {/* Text Content Area */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h4 className={`text-sm truncate transition-colors ${chat.unreadCount > 0
                                                    ? "font-bold text-white"
                                                    : "font-semibold text-slate-300 group-hover:text-slate-200"
                                                }`}>
                                                {chat.displayName}
                                            </h4>
                                            <span className={`text-[10px] font-medium transition-colors ${chat.unreadCount > 0 ? "text-indigo-300" : "text-slate-500"
                                                }`}>
                                                {chat.lastUpdated
                                                    ? new Date(chat.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                    : ""}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center gap-2">
                                            <p className={`text-xs truncate leading-relaxed flex-1 transition-colors ${chat.unreadCount > 0
                                                    ? "text-slate-200 font-medium"
                                                    : "text-slate-400 group-hover:text-slate-300"
                                                }`}>
                                                {chat.lastMessage || <span className="italic opacity-50">No messages yet</span>}
                                            </p>

                                            {chat.unreadCount > 0 && (
                                                <div className="shrink-0 bg-indigo-500 text-white text-[10px] font-bold h-5 min-w-[1.25rem] px-1.5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-in zoom-in duration-200">
                                                    {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </aside>

                {/* CHAT WINDOW (MAIN) */}
                <main className="flex-1 flex flex-col bg-slate-950/20 relative min-w-0">
                    {!activeChat ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-600 animate-in fade-in zoom-in duration-300">
                            <div className="bg-slate-900/50 p-6 rounded-full border border-white/5 mb-4">
                                <MessageSquare size={48} className="text-slate-700" />
                            </div>
                            <p className="text-sm font-medium tracking-wide">Select a peer to start chatting</p>
                        </div>
                    ) : (
                        <>
                            {/* CHAT WINDOW HEADER */}
                            <div className="px-6 py-4 border-b border-white/5 bg-slate-900/40 backdrop-blur-md flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={activeChat.profilePhoto || `https://ui-avatars.com/api/?name=${activeChat.displayName}`}
                                        className="w-10 h-10 rounded-xl object-cover"
                                        alt=""
                                    />
                                    <div>
                                        <h3 className="font-bold text-base leading-none mb-1">{activeChat.displayName}</h3>
                                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Online</p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-all">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            {/* MESSAGES AREA */}
                            <div className="flex-1 p-6 overflow-y-auto space-y-3 custom-scrollbar">
                                <div className="flex flex-col items-center justify-center py-6 opacity-20 select-none">
                                    <CheckCheck size={24} className="text-indigo-400 mb-2" />
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em]">End-to-End Encrypted</p>
                                </div>

                                {messagesLoading ? (
                                    <div className="flex justify-center py-10">
                                        <Loader2 className="animate-spin text-indigo-500" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <p className="text-center text-slate-500 text-sm py-10">
                                        No messages yet. Say hi!
                                    </p>
                                ) : (
                                    messages.map((msg, index) => {
                                        // Ensure we compare Strings to Strings
                                        const isMe = String(msg.senderId) !== String(activeChat.friendId);
                                        return (
                                            <div
                                                key={msg.id || index}
                                                className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                                            >
                                                <div
                                                    className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl text-sm shadow-sm ${isMe
                                                        ? "bg-indigo-600 text-white rounded-br-none"
                                                        : "bg-slate-800 text-slate-200 rounded-bl-none border border-white/5"
                                                        }`}
                                                >
                                                    {msg.content}
                                                    <div className={`text-[10px] mt-1 opacity-60 text-right ${isMe ? "text-indigo-200" : "text-slate-500"}`}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* MESSAGE INPUT AREA */}
                            <div className="p-6 bg-slate-900/20 shrink-0">
                                <div className="max-w-4xl mx-auto flex items-center gap-3 bg-slate-800/80 border border-white/10 rounded-[1.25rem] px-4 py-2.5 shadow-2xl focus-within:border-indigo-500/50 transition-all">
                                    <input
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                        placeholder={`Message ${activeChat.displayName}...`}
                                        className="flex-1 bg-transparent outline-none text-sm py-2 placeholder:text-slate-500"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={sending || !message.trim()}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-indigo-600/20 active:scale-90 flex items-center justify-center"
                                    >
                                        {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>

            {/* USER MODAL */}
            {showUserModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h2 className="font-black uppercase tracking-widest text-sm text-indigo-400">Select Peer</h2>
                            <button onClick={() => setShowUserModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2 custom-scrollbar">
                            {userLoading ? (
                                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>
                            ) : (
                                availableUsers.map(user => (
                                    <div
                                        key={user._id}
                                        onClick={() => startChat(user)}
                                        className="flex items-center gap-4 p-3 hover:bg-indigo-600/10 rounded-2xl cursor-pointer transition-all group border border-transparent hover:border-indigo-500/20"
                                    >
                                        <img
                                            src={user.profilePhoto || `https://ui-avatars.com/api/?name=${user.displayName}`}
                                            className="w-12 h-12 rounded-xl object-cover"
                                            alt=""
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm group-hover:text-indigo-400 transition-colors">{user.displayName}</h4>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">View Profile</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}