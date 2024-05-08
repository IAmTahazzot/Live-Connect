import {currentProfile} from "@/lib/current-profile";
import {redirectToSignIn} from "@clerk/nextjs";
import {db} from "@/lib/db";
import {getOrCreateConversation} from "@/lib/conversation";
import {redirect} from "next/navigation";
import {ChatHeader} from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";

interface MemberIdPageProps {
    params: {
        serverId: string;
        memberId: string;
    }
}

export default async function MemberIdPage({ params }: MemberIdPageProps) {
   const profile = await currentProfile()

   if (!profile) {
       return redirectToSignIn()
   }

   const currentMember = await db.member.findFirst({
       where: {
           profileId: profile.id,
           serverId: params.serverId,
       },
       include: {
           profile: true
       }
   } as any)

    if (!currentMember) {
        return 'something went wrong, please try again later'
    }

    // params.memberId = who we are talking to
    // currentMember.id = who is talking
    const conversation = await getOrCreateConversation(currentMember.id, params.memberId)

    if (!conversation) {
        return redirect(`/servers/${params.serverId}`)
    }

    const { memberOne, memberTwo } = conversation
    const otherMember = memberOne.id === currentMember.id ? memberTwo : memberOne

    return (
        <div className={'bg-white dark:bg-[#313338] flex flex-col h-full'}>
            <ChatHeader
                imageUrl={otherMember.profile.imageUrl}
                type={'conversation'}
                name={otherMember.profile.name}
                serverId={params.serverId}
            />

            <ChatMessages
                member={currentMember}
                name={otherMember.profile.name}
                chatId={conversation.id}
                type="conversation"
                apiUrl="/api/direct-messages"
                paramKey="conversationId"
                paramValue={conversation.id}
                socketUrl="/api/socket/direct-messages"
                socketQuery={{
                    conversationId: conversation.id,
                }}
            />

            <ChatInput
                name={otherMember.profile.name}
                type="conversation"
                apiUrl="/api/socket/direct-messages"
                query={{
                    conversationId: conversation.id,
                }}
            />
        </div>
    )
}