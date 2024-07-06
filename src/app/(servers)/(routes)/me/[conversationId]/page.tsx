import { ChatHeader } from '@/components/chat/chat-header'
import { ChatHeaderForMe } from '@/components/chat/chat-header-for-me'
import ChatInput from '@/components/chat/chat-input'
import { UserMessages } from '@/components/chat/user-messages'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

export default async function UserConversationPage({ params }: { params: { conversationId: string } }) {
  const profile = await currentProfile()

  const conversation = await db.conversation.findFirst({
    where: {
      id: params.conversationId,
    },
    include: {
      userOne: true,
      userTwo: true,
    },
  })

  // get the user that is not the current user means the other user
  const secondUser = conversation?.userOneId === profile?.id ? conversation?.userTwo : conversation?.userOne

  return (
    <div className={'bg-white dark:bg-[hsl(var(--background-primary))] grid grid-rows-[50px,1fr,auto] h-full'}>
      <ChatHeaderForMe
        type="conversation"
        name={secondUser?.name || 'unknown'}
        serverId={params.conversationId}
        imageUrl={secondUser?.imageUrl}
      />

      <UserMessages
        profile={profile!}
        name={secondUser?.name || 'unknown'}
        type={'conversation'}
        apiUrl={'/api/user-messages'}
        socketUrl={'/api/socket/user-messages'}
        socketQuery={{
          conversationId: params.conversationId,
        }}
        paramKey={'conversationId'}
        paramValue={params.conversationId}
        chatId={params.conversationId}
      />

      <ChatInput
        name={'Say something...'}
        type="conversation"
        apiUrl="/api/socket/user-messages"
        query={{
          conversationId: params.conversationId,
        }}
      />
    </div>
  )
}
