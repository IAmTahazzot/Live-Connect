'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { io as socketIO, Socket } from 'socket.io-client'

type SocketContextType = {
    socket: any | null;
    isSocketConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isSocketConnected: false
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: {
    children: React.ReactNode
}) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false)

    useEffect(() => {
        const socket = new (socketIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
            path: '/api/socket/io',
            addTrailingSlash: false,
        })

        socket.on('connect', () => {
            setIsSocketConnected(true)
        })

        socket.on('disconnect', () => {
            setIsSocketConnected(false)
        })

        setSocket(socket)

        return () => {
            socket.disconnect()
        }
    }, [])

    return (
        <SocketContext.Provider value={{ socket, isSocketConnected }}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider