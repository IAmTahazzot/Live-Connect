'use client'

import {Member, Message, Profile} from "@prisma/client";
import ChatWelcome from "@/components/chat/chat-welcome";
import {useChatQuery} from "@/hooks/use-chat-query";
import { ImSpinner9 } from "react-icons/im";
import { LuServerCrash } from "react-icons/lu";
import {ElementRef, Fragment, useRef} from "react";
import ChatItem from "@/components/chat/chat-item";
import { format } from 'date-fns'
import {useChatSocket} from "@/hooks/use-chat-socket";
import {useChatScroll} from "@/components/chat/use-chat-scroll";
const DATE_FORMAT = "d MMM yyyy, HH:mm";
type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: 'channelId' | 'conversationId';
    paramValue: string;
    type: 'channel' | 'conversation';
}

const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type,
}: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`;
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:messages:update`

    const chatRef = useRef<ElementRef<'div'>>(null)
    const bottomRef = useRef<ElementRef<'div'>>(null)

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue,
    })

    useChatSocket({
        queryKey,
        addKey,
        updateKey
    })
    useChatScroll({
        chatRef,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: (!isFetchingNextPage && hasNextPage) || false,
        count: data?.pages?.[0]?.items?.length ?? 0
    })

    if (status === 'loading' ) {
        return (
            <div className={'flex flex-col flex-1 justify-center items-center'}>
                <ImSpinner9 className={'animate-spin text-2xl text-gray-500 dark:text-gray-400 my-4'} />
                <p className="text-zinc-500 dark:text-zinc-400">
                    Loading...
                </p>
            </div>
        )
    }

    if (status === "error") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <LuServerCrash className="h-7 w-7 text-zinc-500 my-4" />
                <p className="text-zinc-500 dark:text-zinc-400">
                    Something went wrong!
                </p>
            </div>
        )
    }


    return (
        <div
            ref={chatRef}
            className={'flex-1 flex flex-col py-4 overflow-y-auto'}>

            <div className={'mt-auto'}>
                {!hasNextPage && (
                    <ChatWelcome
                        type={type}
                        name={name}
                    />
                )}

                {
                    isFetchingNextPage && (
                        <div className={'flex justify-center items-center'}>
                            <ImSpinner9 className={'animate-spin text-2xl text-gray-500 dark:text-gray-400 my-4'} />
                        </div>
                    )
                }

                {
                    !isFetchingNextPage && hasNextPage && (
                        <button
                            onClick={() => fetchNextPage()}
                            className={'mx-auto my-5 text-sm block'}>
                            load previous messages
                        </button>
                        )
                }

                <div className={'flex flex-col-reverse mt-auto'}>
                    {data?.pages.map((page, i) => (
                        page ? (
                            <Fragment key={i}>
                                {page.items.map((message: MessageWithMemberWithProfile) => {
                                    return <ChatItem
                                        key={message.id}
                                        id={message.id}
                                        currentMember={member}
                                        member={message.member}
                                        content={message.content}
                                        fileUrl={message.fileUrl}
                                        deleted={message.deleted}
                                        timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                        isUpdated={message.updatedAt !== message.createdAt}
                                        socketUrl={socketUrl}
                                        socketQuery={socketQuery}
                                    />
                                })}
                            </Fragment>
                        ) : 'Something went terribly wrong, please refresh the page'
                    ))}
                </div>
            </div>

            <div ref={bottomRef} />
        </div>
    )
}

export default ChatMessages