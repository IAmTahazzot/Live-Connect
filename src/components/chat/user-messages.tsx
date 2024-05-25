'use client'

import { Member, Message, Profile, UserMessages as DBUserMessages } from '@prisma/client'
import ChatWelcome from '@/components/chat/chat-welcome'
import { useChatQuery } from '@/hooks/use-chat-query'
import { ImSpinner9 } from 'react-icons/im'
import { LuServerCrash } from 'react-icons/lu'
import { ElementRef, Fragment, useRef, useState } from 'react'
import ChatItem from '@/components/chat/chat-item'
import { format } from 'date-fns'
import { useChatSocket } from '@/hooks/use-chat-socket'
import { useChatScroll } from '@/components/chat/use-chat-scroll'
import { ChatDispatchLoader } from '../loader/chat-dispatch-loader'
import { UserMessage } from './user-message'

type MessageWithProfile = DBUserMessages & {
  profile: Profile
}

interface UserMessagesProps {
  name: string
  profile: Profile
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, string>
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
  type: 'channel' | 'conversation'
}

export const UserMessages = ({
  name,
  profile,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: UserMessagesProps) => {
  const queryKey = `chat:${chatId}`
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update`

  const chatRef = useRef<ElementRef<'div'>>(null)
  const bottomRef = useRef<ElementRef<'div'>>(null)
  let sameUserMessageBucket: MessageWithProfile[] = []
  let prevMessage: MessageWithProfile | null = null
  const dynamicLoaderCount = Math.floor(Math.random() * 10 + 5)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  })

  useChatSocket({
    queryKey,
    addKey,
    updateKey,
  })

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: (!isFetchingNextPage && hasNextPage) || false,
    count: data?.pages?.[0]?.items?.length ?? 0,
  })

  if (status === 'loading') {
    const dynamicLoaderCount = Math.floor(Math.random() * 10 + 5)

    return (
      <div className="self-end px-4 h-full overflow-y-auto">
        {Array.from({ length: dynamicLoaderCount }).map((_, i) => (
          <ChatDispatchLoader key={i} />
        ))}
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="self-end px-4 h-full py-4 flex flex-col justify-center items-center">
        <LuServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-zinc-500 dark:text-zinc-400">Something went wrong!</p>
      </div>
    )
  }

  const renderMessageBucket = (bucketDispatch: MessageWithProfile[]) => {
    const bucketDispatchSorted = bucketDispatch.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

    return (
      <div key={Math.random().toString()} className="bucket-list">
        {bucketDispatchSorted.map((message, index) => {
          const DATE_FORMAT = 'd MMM yyyy, HH:mm'
          const date = new Date(message.createdAt)
          const formattedDate = format(date, DATE_FORMAT)

          return (
            <UserMessage
              key={index}
              id={message.id}
              currentUser={profile}
              profile={message.profile}
              content={message.content}
              fileUrl={message.fileUrl}
              deleted={message.delete}
              timestamp={formattedDate}
              isUpdated={message.updatedAt !== message.createdAt}
              socketUrl={socketUrl}
              socketQuery={socketQuery}
              isRapid={index !== 0}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div ref={chatRef} className={'self-end grid items-end grid-rows-[1fr,auto] h-full py-4 overflow-y-auto'}>
      <div className={'mt-auto'}>
        {!hasNextPage && <ChatWelcome type={type} name={name} />}

        {isFetchingNextPage && (
          <div className="self-end px-4 h-full overflow-y-auto">
            {Array.from({ length: dynamicLoaderCount }).map((_, i) => (
              <ChatDispatchLoader key={i} />
            ))}
          </div>
        )}

        {!isFetchingNextPage && hasNextPage && (
          <div
            className="self-end px-4 h-full overflow-y-auto"
            onMouseEnter={() => {
              fetchNextPage()
            }}>
            <ChatDispatchLoader />
            <ChatDispatchLoader />
          </div>
        )}

        <div className={'flex flex-col-reverse mt-auto'}>
          {data?.pages.map((page, i) => {
            const length = page?.items.length

            return page ? (
              <Fragment key={i}>
                {page.items.map((message: MessageWithProfile, index: number) => {
                  if (!prevMessage) {
                    // initial message
                    prevMessage = message
                  }

                  const isSameUser = prevMessage.profileId === message.profileId

                  if (isSameUser) {
                    const prevMessageDate = new Date(prevMessage.createdAt)
                    const messageDate = new Date(message.createdAt)
                    const differenceInSeconds = Math.abs(messageDate.getTime() - prevMessageDate.getTime()) / 1000

                    if (differenceInSeconds < 60) {
                      sameUserMessageBucket.push(message)

                      if (index === length - 1) {
                        const bucketMessagesDOM = renderMessageBucket(sameUserMessageBucket)
                        sameUserMessageBucket = []
                        return bucketMessagesDOM
                      }
                    } else {
                      const bucketMessagesDOM = renderMessageBucket(sameUserMessageBucket)
                      sameUserMessageBucket = []
                      sameUserMessageBucket.push(message)
                      return bucketMessagesDOM
                    }

                    prevMessage = message
                  } else {
                    prevMessage = message
                    const bucketMessagesDOM = renderMessageBucket(sameUserMessageBucket)
                    sameUserMessageBucket = []
                    sameUserMessageBucket.push(message)

                    return bucketMessagesDOM
                  }
                })}
              </Fragment>
            ) : (
              <div key={i} className="p-4">
                Something went terribly wrong, please refresh the page
              </div>
            )
          })}
        </div>
      </div>

      <div ref={bottomRef} />
    </div>
  )
}
