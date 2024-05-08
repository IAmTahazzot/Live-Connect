"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
    chatId: string;
    video: boolean;
    audio: boolean;
}

export const MediaRoom = ({
                              chatId,
                              video,
                              audio
                          }: MediaRoomProps) => {

    const { user, isSignedIn, isLoaded } = useUser();
    const [token, setToken] = useState("");

    useEffect(() => {
        if (!user?.firstName) return;

        const name = `${user.firstName} ${user?.lastName || ""}`;

        (async () => {
            try {
                const resp = await fetch(`/api/livekit?room=${chatId}&username=${name.trim()}`);
                const data = await resp.json();
                setToken(data.token);
            } catch (e) {
                console.log(e);
            }
        })()
    }, [user?.firstName, user?.lastName, chatId, isLoaded, user]);

    if (!isSignedIn || !isLoaded) {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2
                    className="h-7 w-7 text-zinc-500 animate-spin my-4"
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Getting user info
                </p>
            </div>
        )
    }

    if (token === "") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2
                    className="h-7 w-7 text-zinc-500 animate-spin my-4"
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Connecting to media server
                </p>
            </div>
        )
    }

    return (
        <LiveKitRoom
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={video}
            audio={audio}
        >
            <VideoConference />
        </LiveKitRoom>
    )
}