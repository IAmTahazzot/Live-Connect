'use client'

import {useSocket} from "@/components/providers/socket-provider";
import {Badge} from "@/components/ui/badge";

const SocketIndicator = () => {
    const { isSocketConnected } = useSocket()

    if (!isSocketConnected) {
        return (
            <Badge variant={'outline'}
                   className={'text-white border-none'}>
                <div className={'h-2 w-2 rounded-full bg-yellow-600 mr-1'}></div>
                <span>Connecting to server...</span>
            </Badge>
        )
    }

    return (
        <Badge variant={'outline'}
               className={'text-white border-none'}>
            <div className={'h-2 w-2 rounded-full bg-emerald-600 mr-1 animation-indicator-waves animation-indicator-waves__success'}></div>
            <span>Live</span>
        </Badge>
    )
}

export default SocketIndicator