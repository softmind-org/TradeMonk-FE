/**
 * useChat Hook
 * Business logic hook combining chatService + useSocket
 * for conversation management and real-time updates.
 */
import { useState, useEffect, useCallback } from 'react'
import { chatService } from '../services/chatService'
import useSocket from './useSocket'

const useChat = () => {
    const [conversations, setConversations] = useState([])
    const [activeConversation, setActiveConversation] = useState(null)
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const { 
        onNewMessage, 
        onMessagesRead, 
        isConnected, 
        onTyping, 
        onStopTyping, 
        emitTyping, 
        emitStopTyping 
    } = useSocket()

    /**
     * Fetch all conversations
     */
    const fetchConversations = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await chatService.getConversations()
            if (response?.success) {
                setConversations(response.data || [])
            }
        } catch (err) {
            console.error('Failed to fetch conversations:', err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }, [])

    /**
     * Start or find a conversation
     */
    const startConversation = useCallback(async (productId, sellerId) => {
        try {
            setIsLoading(true)
            const response = await chatService.getOrCreateConversation(productId, sellerId)
            if (response?.success) {
                setActiveConversation(response.data)
                // Refresh conversation list
                await fetchConversations()
                return response.data
            }
        } catch (err) {
            console.error('Failed to start conversation:', err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }, [fetchConversations])

    /**
     * Fetch messages for active conversation
     */
    const fetchMessages = useCallback(async (conversationId, page = 1) => {
        try {
            const response = await chatService.getMessages(conversationId, page)
            if (response?.success) {
                if (page === 1) {
                    setMessages(response.data || [])
                } else {
                    setMessages(prev => [...(response.data || []), ...prev])
                }
                return response.pagination
            }
        } catch (err) {
            console.error('Failed to fetch messages:', err)
        }
    }, [])

    /**
     * Send a message
     */
    const sendMessage = useCallback(async (conversationId, text, imageFile) => {
        try {
            let messageData
            if (imageFile) {
                messageData = new FormData()
                if (text) messageData.append('text', text)
                messageData.append('image', imageFile)
            } else {
                messageData = { text }
            }

            const response = await chatService.sendMessage(conversationId, messageData)
            if (response?.success) {
                setMessages(prev => [...prev, response.data])
                // Update conversation list preview
                setConversations(prev =>
                    prev.map(conv =>
                        conv._id === conversationId
                            ? {
                                ...conv,
                                lastMessage: {
                                    text: text || (response.data.image ? '📎 Attachment' : 'New message'),
                                    sender: response.data.sender._id,
                                    timestamp: new Date()
                                }
                            }
                            : conv
                    )
                )
                return response.data
            }
        } catch (err) {
            console.error('Failed to send message:', err)
            setError(err.message)
        }
    }, [])

    /**
     * Mark conversation as read
     */
    const markAsRead = useCallback(async (conversationId) => {
        try {
            await chatService.markAsRead(conversationId)
            setConversations(prev =>
                prev.map(conv => {
                    if (conv._id === conversationId) {
                        const userId = JSON.parse(localStorage.getItem('user') || '{}')._id
                        const updated = { ...conv }
                        if (updated.unreadCount) {
                            updated.unreadCount = { ...updated.unreadCount, [userId]: 0 }
                        }
                        return updated
                    }
                    return conv
                })
            )
        } catch (err) {
            console.error('Failed to mark as read:', err)
        }
    }, [])

    /**
     * Real-time: Listen for new incoming messages
     */
    useEffect(() => {
        const cleanup = onNewMessage(({ message, conversationId }) => {
            // If we're viewing this conversation, add the message
            if (activeConversation?._id === conversationId) {
                setMessages(prev => [...prev, message])
            }
            // Update conversation list
            setConversations(prev =>
                prev.map(conv =>
                    conv._id === conversationId
                        ? {
                            ...conv,
                            lastMessage: {
                                text: message.text || (message.image ? '📎 Attachment' : 'New message'),
                                sender: message.sender._id || message.sender,
                                timestamp: new Date()
                            }
                        }
                        : conv
                )
            )
        })
        return cleanup
    }, [onNewMessage, activeConversation])

    /**
     * Real-time: Listen for read receipts
     */
    useEffect(() => {
        const cleanup = onMessagesRead(({ conversationId }) => {
            if (activeConversation?._id === conversationId) {
                setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })))
            }
        })
        return cleanup
    }, [onMessagesRead, activeConversation])

    return {
        conversations,
        activeConversation,
        setActiveConversation,
        messages,
        isLoading,
        error,
        isConnected,
        fetchConversations,
        startConversation,
        fetchMessages,
        sendMessage,
        markAsRead,
        onTyping,
        onStopTyping,
        emitTyping,
        emitStopTyping
    }
}

export default useChat
