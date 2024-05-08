import { currentProfile } from "@/lib/current-profile";
import {redirectToSignIn} from "@clerk/nextjs";
import {db} from "@/lib/db";
import { ChatHeader } from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import {ChannelType} from "@prisma/client";
import {MediaRoom} from "@/components/media-room";

interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string;
    }
}

const ChannelIdPage = async (
    { params }: ChannelIdPageProps
) => {
    const profile = await currentProfile()
    const { serverId, channelId } = params;

    if (!profile) {
        return redirectToSignIn()
    }

    const channel = await db.channel.findFirst({
        where: {
            id: channelId,
        }
    } as any)

    const member = await db.member.findFirst({
        where: {
            profileId: profile.id,
            serverId,
        }
    } as any)

    if (!channel || !member) {
        return 'something went wrong, please try again later'
    }

    return (
        <div className={'bg-white dark:bg-[#313338] flex flex-col h-full'}>
            <ChatHeader type={'channel'} name={channel.name} serverId={serverId} />

            {
                channel.type === ChannelType.TEXT && (
                    <>
                        <ChatMessages
                            member={member}
                            name={channel.name}
                            type={'channel'}
                            apiUrl={'/api/messages'}
                            socketUrl={'/api/socket/messages'}
                            socketQuery={{
                                serverId,
                                channelId,
                            }}
                            paramKey={'channelId'}
                            paramValue={channelId}
                            chatId={channelId}
                        />
                        <ChatInput
                            name={channel.name}
                            type={'channel'}
                            apiUrl={'/api/socket/messages'}
                            query={{
                                serverId: channel.serverId,
                                channelId,
                            } as any}
                        />
                    </>
                )
            }

            {
                channel.type === ChannelType.AUDIO && (
                    <MediaRoom chatId={channel.id} video={false} audio={true} />
                )
            }

            {
                channel.type === ChannelType.VIDEO && (
                    <MediaRoom chatId={channel.id} video={true} audio={true} />
                )
            }

        </div>
    );
}

export default ChannelIdPage;