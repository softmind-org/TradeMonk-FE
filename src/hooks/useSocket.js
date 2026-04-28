/**
 * useSocket Hook
 * Manages a single Socket.io connection with JWT authentication.
 * Provides real-time messaging functions.
 */
import { useEffect, useRef, useCallback, useState } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:5000'

const useSocket = () => {
    const socketRef = useRef(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        // Create socket connection with JWT auth
        socketRef.current = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000
        })

        socketRef.current.on('connect', () => {
            console.log('[Socket] Connected:', socketRef.current.id)
            setIsConnected(true)
        })

        socketRef.current.on('disconnect', (reason) => {
            console.log('[Socket] Disconnected:', reason)
            setIsConnected(false)
        })

        socketRef.current.on('connect_error', (err) => {
            console.error('[Socket] Connection error:', err.message)
            setIsConnected(false)
        })

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
                socketRef.current = null
            }
        }
    }, [])

    /**
     * Listen for incoming messages
     */
    const onNewMessage = useCallback((callback) => {
        if (!socketRef.current) return () => {}
        socketRef.current.on('newMessage', callback)
        return () => socketRef.current?.off('newMessage', callback)
    }, [])

    /**
     * Listen for typing indicators
     */
    const onTyping = useCallback((callback) => {
        if (!socketRef.current) return () => {}
        socketRef.current.on('userTyping', callback)
        return () => socketRef.current?.off('userTyping', callback)
    }, [])

    /**
     * Listen for stop typing
     */
    const onStopTyping = useCallback((callback) => {
        if (!socketRef.current) return () => {}
        socketRef.current.on('userStopTyping', callback)
        return () => socketRef.current?.off('userStopTyping', callback)
    }, [])

    /**
     * Listen for read receipts
     */
    const onMessagesRead = useCallback((callback) => {
        if (!socketRef.current) return () => {}
        socketRef.current.on('messagesRead', callback)
        return () => socketRef.current?.off('messagesRead', callback)
    }, [])

    /**
     * Emit typing indicator
     */
    const emitTyping = useCallback((conversationId, recipientId) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('typing', { conversationId, recipientId })
        }
    }, [])

    /**
     * Emit stop typing
     */
    const emitStopTyping = useCallback((conversationId, recipientId) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('stopTyping', { conversationId, recipientId })
        }
    }, [])

    return {
        isConnected,
        onNewMessage,
        onTyping,
        onStopTyping,
        onMessagesRead,
        emitTyping,
        emitStopTyping
    }
}

export default useSocket
