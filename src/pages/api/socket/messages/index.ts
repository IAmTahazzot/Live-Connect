import {NextApiRequest} from "next";
import {NextApiResponseWithIO} from "@/pages/api/socket/socketTypes";
import {currentProfile} from "@/lib/current-profile-pages";
import {db} from "@/lib/db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseWithIO
) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        const profile = await currentProfile(req);
        const {content, fileUrl} = req.body;
        const {serverId, channelId} = req.query;

        if (!profile) {
            return res.status(401).end();
        }

        if (!serverId) {
            return res.status(400).end();
        }

        if (!channelId) {
            return res.status(400).end();
        }

        if (!content) {
           return res.status(400).end();
        }

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },

            include: {
                members: true
            }
        })

        if (!server) {
            return res.status(404).json({
                message: 'Server not found'
            })
        }

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: server.id as string
            }
        } as any)

        if (!channel) {
            return res.status(404).json({
                message: 'Channel not found'
            })
        }

        const member = server.members.find((member) => {
            return member.profileId === profile.id;
        })

        if (!member) {
            return res.status(401).end();
        }

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        const channelKey = `chat:${channelId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json({
            message
        } as any)
    } catch (error) {
        console.error(error);
        return res.status(500).end();
    }
}