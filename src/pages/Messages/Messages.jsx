import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { MessageSquare, Loader2, Image as ImageIcon } from 'lucide-react'
import useChat from '../../hooks/useChat'
import ChatWindow from './ChatWindow'
import { formatImageUrl } from '@/utils/imageUtils'

const Messages = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const { 
        conversations, 
        activeConversation, 
        setActiveConversation,
        messages, 
        isLoading, 
        isConnected,
        fetchConversations, 
        startConversation,
        fetchMessages,
        sendMessage,
        markAsRead,
        emitTyping,
        emitStopTyping,
        onTyping,
        onStopTyping
    } = useChat()

    const [typingUsers, setTypingUsers] = useState({})
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

    useEffect(() => {
        const loadInitialData = async () => {
            await fetchConversations()
            const productId = searchParams.get('product')
            const sellerId = searchParams.get('seller')
            if (productId && sellerId) {
                const conv = await startConversation(productId, sellerId)
                if (conv) {
                    await fetchMessages(conv._id, 1)
                    setSearchParams({}, { replace: true })
                }
            }
        }
        loadInitialData()
    }, [])

    const uniqueConversations = useMemo(() => {
        if (!conversations) return [];
        const map = new Map();
        conversations.forEach(conv => {
            if (!conv.product) return;
            const key = `${conv.product._id}-${conv.participants?.map(p => p._id).sort().join('-')}`;
            const existing = map.get(key);
            if (!existing || (conv.lastMessage && !existing.lastMessage) || (new Date(conv.updatedAt) > new Date(existing.updatedAt))) {
                map.set(key, conv);
            }
        });
        return Array.from(map.values()).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }, [conversations]);

    const handleSelectConversation = async (conv) => {
        if (activeConversation?._id === conv._id) return
        setActiveConversation(conv)
        await fetchMessages(conv._id, 1)
        if ((conv.unreadCount?.[currentUser._id] || 0) > 0) {
            await markAsRead(conv._id)
        }
    }

    useEffect(() => {
        if (!onTyping || !onStopTyping) return
        const c1 = onTyping(({ conversationId, userId }) => {
            if (userId !== currentUser._id) setTypingUsers(prev => ({ ...prev, [conversationId]: true }))
        })
        const c2 = onStopTyping(({ conversationId, userId }) => {
            setTypingUsers(prev => ({ ...prev, [conversationId]: false }))
        })
        return () => { if(c1) c1(); if(c2) c2(); }
    }, [onTyping, onStopTyping, currentUser._id])

    return (
        <div className="h-screen bg-[#0B1220] flex flex-col p-4 md:p-6 overflow-hidden">
            {/* Top Bar - Fixed Height */}
            <div className="max-w-[1600px] w-full mx-auto mb-4 flex items-center justify-between gap-4 flex-shrink-0">
                <button 
                    onClick={() => {
                        if (activeConversation && window.innerWidth < 768) {
                            setActiveConversation(null)
                        } else {
                            navigate(-1)
                        }
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#D4A017] hover:bg-[#D4A017]/90 text-black font-black rounded-xl transition-all shadow-lg active:scale-95 text-[10px] uppercase tracking-widest z-50"
                >
                    ← Back
                </button>
                <div className="flex-1 text-right md:text-left">
                    <h1 className="text-xl font-black text-white uppercase tracking-tighter italic">TradeMonk <span className="text-[#D4A017]">Messages</span></h1>
                </div>
            </div>

            {/* Main Chat Container - Fills remaining space and handles its own scrolls */}
            <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col md:flex-row bg-[#0F172A] rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative min-h-0">
                
                {/* Left Panel (Conversation List) */}
                <div className={`w-full md:w-[350px] flex-shrink-0 flex flex-col border-r border-white/5 bg-[#0F172A] ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-white/5 bg-[#1E293B]/50 flex items-center justify-between flex-shrink-0">
                        <h2 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare className="text-[#D4A017]" size={14} />
                            Inbox
                        </h2>
                        {isConnected ? (
                            <span className="flex items-center gap-1.5 text-[8px] text-green-500 font-bold uppercase tracking-widest">
                                <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span> Online
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 text-[8px] text-red-500 font-bold uppercase tracking-widest">
                                <span className="w-1 h-1 bg-red-500 rounded-full"></span> Offline
                            </span>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {isLoading && uniqueConversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-[#64748B] gap-3">
                                <Loader2 className="animate-spin text-[#D4A017]" />
                                <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">Syncing...</p>
                            </div>
                        ) : uniqueConversations.length === 0 ? (
                            <div className="text-center p-12 opacity-50">
                                <MessageSquare size={32} className="mx-auto mb-4 text-[#D4A017]" />
                                <p className="text-[10px] uppercase tracking-widest font-black">No Messages Yet</p>
                            </div>
                        ) : (
                            <div className="p-2 space-y-1.5">
                                {uniqueConversations.map(conv => {
                                    const otherUser = conv.participants?.find(p => p._id !== currentUser._id)
                                    const unread = conv.unreadCount?.[currentUser._id] || 0
                                    const isActive = activeConversation?._id === conv._id
                                    const displayName = otherUser?.fullName || otherUser?.email || 'User'

                                    return (
                                        <button
                                            key={conv._id}
                                            onClick={() => handleSelectConversation(conv)}
                                            className={`w-full text-left p-3.5 rounded-2xl flex gap-3.5 items-center transition-all group ${
                                                isActive 
                                                    ? 'bg-[#1E293B] border border-[#D4A017]/30 shadow-xl scale-[1.02]' 
                                                    : 'hover:bg-white/[0.03] border border-transparent'
                                            }`}
                                        >
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1E293B] flex-shrink-0 border border-white/10 relative">
                                                {(() => {
                                                    const path = conv.product?.images?.[0];
                                                    const stablePokemonBack = 'https://upload.wikimedia.org/wikipedia/en/3/3b/Pokemon_Trading_Card_Game_cardback.jpg';
                                                    let imgSrc = formatImageUrl(path);
                                                    if (path && (path.includes('assets.pokemon.com') || path.includes('limitlesstcg.s3'))) imgSrc = stablePokemonBack;
                                                    return path ? (
                                                        <img src={imgSrc} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" onError={(e) => { e.target.src = stablePokemonBack }} />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[#D4A017] font-bold text-[10px]">CARD</div>
                                                    );
                                                })()}
                                                {unread > 0 && (
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4A017] rounded-full border border-[#0F172A] flex items-center justify-center text-[8px] text-black font-black">
                                                        {unread}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-0.5">
                                                    <h4 className={`font-bold text-xs truncate ${isActive ? 'text-[#D4A017]' : 'text-white'}`}>{displayName}</h4>
                                                    <span className="text-[8px] text-[#64748B] font-bold uppercase">{conv.updatedAt ? new Date(conv.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}</span>
                                                </div>
                                                <p className="text-[8px] text-[#94A3B8] truncate mb-1 font-bold uppercase tracking-widest opacity-60">{conv.product?.title}</p>
                                                <div className="text-[10px] text-[#64748B] truncate flex items-center gap-1.5 font-bold uppercase overflow-hidden">
                                                    <span className="truncate opacity-80">{conv.lastMessage?.text || 'No messages yet'}</span>
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel (Chat Window) */}
                <div className={`flex-1 flex flex-col bg-[#0F172A] min-h-0 ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
                    {activeConversation ? (
                        <ChatWindow 
                            conversation={activeConversation}
                            messages={messages}
                            currentUser={currentUser}
                            onSendMessage={sendMessage}
                            onEmitTyping={emitTyping}
                            onEmitStopTyping={emitStopTyping}
                            isTyping={typingUsers[activeConversation._id]}
                        />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12">
                            <div className="w-24 h-24 bg-[#1E293B] border border-white/5 rounded-full flex items-center justify-center mb-8 text-[#D4A017]/10 relative">
                                <MessageSquare size={40} />
                                <div className="absolute inset-0 bg-[#D4A017]/5 rounded-full blur-2xl"></div>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3 tracking-tighter uppercase italic">Messenger <span className="text-[#D4A017]">Core</span></h3>
                            <p className="text-[#94A3B8] max-w-xs text-[10px] leading-relaxed font-black uppercase tracking-widest opacity-30">
                                Secure end-to-end encrypted marketplace communications.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Messages
