import {NextResponse} from "next/server";
import {currentProfile} from "@/lib/current-profile";
import {db} from "@/lib/db";
import {randomUUID} from "crypto";

export async function PATCH(
    req: Request,
    {params}: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile()

        if (!profile) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        if (!params.serverId) {
            return new NextResponse('Bad request', {status: 400})
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                inviteCode: randomUUID()
            }
        })

        return NextResponse.json(server);
    } catch (error) {
        console.log('[SERVER_ID] ERROR: ', error)
        return new NextResponse('Internal error', {status: 500})
    }
}