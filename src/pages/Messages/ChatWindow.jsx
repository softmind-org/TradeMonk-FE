import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, X, Loader2, FileText, Download, FileJson, FileCode, Archive, FileSpreadsheet, FileType } from 'lucide-react'
import { formatImageUrl } from '@/utils/imageUtils'

const ChatWindow = ({ 
    conversation, 
    messages, 
    currentUser, 
    onSendMessage, 
    onEmitTyping, 
    onEmitStopTyping,
    isTyping
}) => {
    const [newMessage, setNewMessage] = useState('')
    const [file, setFile] = useState(null)
    const [filePreview, setFilePreview] = useState(null)
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef(null)
    const fileInputRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            setFile(selectedFile)
            if (selectedFile.type.startsWith('image/')) {
                setFilePreview(URL.createObjectURL(selectedFile))
            } else {
                setFilePreview('document')
            }
        }
    }

    const handleRemoveFile = () => {
        setFile(null)
        setFilePreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() && !file) return

        setIsSending(true)
        try {
            await onSendMessage(conversation._id, newMessage.trim(), file)
            setNewMessage('')
            handleRemoveFile()
            if (conversation.participants) {
                const recipient = conversation.participants.find(p => p._id !== currentUser._id)
                if (recipient) onEmitStopTyping(conversation._id, recipient._id)
            }
        } catch (err) {
            console.error('Send failed:', err)
        } finally {
            setIsSending(false)
        }
    }

    const handleChange = (e) => {
        setNewMessage(e.target.value)
        if (conversation.participants) {
            const recipient = conversation.participants.find(p => p._id !== currentUser._id)
            if (recipient) {
                if (e.target.value) onEmitTyping(conversation._id, recipient._id)
                else onEmitStopTyping(conversation._id, recipient._id)
            }
        }
    }

    if (!conversation) return null

    const otherParticipant = conversation.participants?.find(p => p._id !== currentUser._id)
    const otherName = otherParticipant?.fullName || otherParticipant?.email || 'User'
    const otherInitial = otherName.charAt(0).toUpperCase()

    const getFileIcon = (fileName) => {
        if (!fileName) return <FileText size={48} className="text-[#D4A017]" />;
        const ext = fileName.split('.').pop().toLowerCase();
        
        switch (ext) {
            case 'pdf': return <FileType size={48} className="text-red-500" />;
            case 'zip':
            case 'rar':
            case '7z': return <Archive size={48} className="text-yellow-500" />;
            case 'csv':
            case 'xlsx':
            case 'xls': return <FileSpreadsheet size={48} className="text-green-500" />;
            case 'doc':
            case 'docx': return <FileText size={48} className="text-blue-500" />;
            case 'json': return <FileJson size={48} className="text-orange-500" />;
            case 'js':
            case 'jsx':
            case 'ts':
            case 'tsx':
            case 'html':
            case 'css': return <FileCode size={48} className="text-purple-500" />;
            default: return <FileText size={48} className="text-[#D4A017]" />;
        }
    }

    const getFileName = (path) => {
        if (!path) return 'File Attachment';
        const parts = path.split('/');
        const rawName = parts[parts.length - 1];
        const nameParts = rawName.split('-');
        if (nameParts.length > 2) return nameParts.slice(2).join('-');
        return rawName;
    }

    return (
        <div className="flex flex-col h-full bg-[#0F172A] relative overflow-hidden">
            {/* Header - Fixed Height */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#1E293B] shadow-lg z-10 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#D4A01733] border border-[#D4A01755] rounded-lg flex items-center justify-center font-black text-[#D4A017] text-sm overflow-hidden flex-shrink-0 shadow-inner">
                        {otherParticipant?.avatar ? (
                            <img src={formatImageUrl(otherParticipant.avatar)} alt="" className="w-full h-full object-cover" />
                        ) : (
                            otherInitial
                        )}
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-white font-bold text-base leading-tight tracking-tight">{otherName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-[#64748B] font-black uppercase tracking-widest">Regarding:</span>
                            <span className="text-[10px] text-[#D4A017] font-bold truncate max-w-[200px] md:max-w-[400px]">{conversation.product?.title || 'Card Listing'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area - SCROLLABLE ONLY HERE */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[#0F172A]">
                {messages.map((msg, idx) => {
                    const isMine = msg.sender?._id === currentUser._id || msg.sender === currentUser._id
                    const msgFile = msg.image;
                    // Fix: Only check for image extensions, NOT the word 'image' in path
                    const isImg = msgFile && msgFile.match(/\.(jpeg|jpg|gif|png|webp|jfif|bmp)$/i);
                    const fileName = getFileName(msgFile);

                    return (
                        <div key={msg._id || idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMine ? 'items-end' : 'items-start'}`}>
                                <div className={`px-4 py-3 rounded-2xl shadow-lg transition-all flex flex-col ${
                                    isMine 
                                        ? 'bg-[#D4A017] text-black font-semibold rounded-tr-none' 
                                        : 'bg-[#1E293B] text-white rounded-tl-none border border-white/5'
                                }`}>
                                    {msgFile && (
                                        <div className="mb-2 flex-shrink-0">
                                            {isImg ? (
                                                <div className="rounded-xl overflow-hidden cursor-pointer bg-black/20 min-h-[100px] min-w-[150px] flex items-center justify-center" onClick={() => window.open(formatImageUrl(msgFile), '_blank')}>
                                                    <img src={formatImageUrl(msgFile)} alt="" className="max-h-72 w-full object-cover" />
                                                </div>
                                            ) : (
                                                /* FOLDER STYLE SQUARE CARD */
                                                <div 
                                                    onClick={() => window.open(formatImageUrl(msgFile), '_blank')}
                                                    className={`w-[160px] h-[160px] rounded-2xl flex flex-col items-center justify-center p-4 gap-3 cursor-pointer transition-all border-2 relative group flex-shrink-0 mx-auto ${
                                                        isMine 
                                                            ? 'bg-[#0F172A] border-black/20 text-white shadow-xl hover:scale-105' 
                                                            : 'bg-[#0F172A] border-[#D4A017]/40 text-[#D4A017] shadow-xl hover:scale-105'
                                                    }`}
                                                >
                                                    {getFileIcon(fileName)}
                                                    <p className="text-[10px] font-black text-center break-all line-clamp-2 uppercase tracking-tighter leading-tight w-full px-1">
                                                        {fileName}
                                                    </p>
                                                    <div className="absolute top-2 right-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                                        <Download size={14} />
                                                    </div>
                                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors"></div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {msg.text && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                                </div>
                                <span className="text-[9px] text-[#64748B] mt-1.5 font-bold uppercase tracking-widest opacity-60">
                                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    )
                })}
                
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-[#1E293B] rounded-2xl rounded-tl-none px-4 py-2.5 flex gap-1.5 items-center border border-white/5 shadow-md">
                            <span className="w-1.5 h-1.5 bg-[#D4A017] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-1.5 h-1.5 bg-[#D4A017] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-1.5 h-1.5 bg-[#D4A017] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed Height */}
            <div className="p-4 bg-[#1E293B] border-t border-white/5 shadow-2xl flex-shrink-0">
                {filePreview && (
                    <div className="mb-4 relative inline-block group ml-2">
                        {filePreview === 'document' ? (
                            <div className="w-[140px] h-[140px] rounded-2xl bg-[#0F172A] border-2 border-[#D4A017] flex flex-col items-center justify-center p-4 text-center gap-3 shadow-xl relative overflow-hidden">
                                {getFileIcon(file?.name)}
                                <span className="text-[9px] text-white font-black truncate w-full px-1 uppercase tracking-tighter">{file?.name}</span>
                            </div>
                        ) : (
                            <div className="w-[140px] h-[140px] rounded-2xl overflow-hidden border-2 border-[#D4A017] shadow-xl relative">
                                <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <button 
                            onClick={handleRemoveFile}
                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-2xl z-20 border-2 border-[#1E293B] hover:scale-110 active:scale-95 transition-transform"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex gap-3 items-center max-w-6xl mx-auto px-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl text-[#94A3B8] h-[52px] w-[52px] flex items-center justify-center flex-shrink-0 border border-white/10">
                        <Paperclip size={22} />
                    </button>
                    <div className="flex-1">
                        <textarea 
                            rows="1"
                            value={newMessage}
                            onChange={(e) => {
                                handleChange(e);
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                            }}
                            placeholder="Type a message..."
                            className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#D4A017] transition-all resize-none max-h-32 text-sm shadow-inner"
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSending || (!newMessage.trim() && !file)}
                        className="h-[52px] px-6 bg-[#D4A017] hover:bg-[#D4A017]/90 text-black font-black rounded-2xl transition-all disabled:opacity-20 flex items-center justify-center gap-2 flex-shrink-0 shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        <span className="hidden sm:inline uppercase text-[10px] tracking-widest font-black">Send</span>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChatWindow
