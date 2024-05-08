import {currentProfile} from "@/lib/current-profile";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function PATCH(
    req: Request,
    {params}: { params: { inviteCode: string } }
) {
    try {
        const profile = await currentProfile()

        if (!profile) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        if (!params.inviteCode) {
            return new NextResponse('Bad request', {status: 400})
        }

        const server = await db.server.update({
            where: {
                inviteCode: params.inviteCode
            },
            data: {
                members: {
                    create: [
                        {
                            profileId: profile.id,
                        }
                    ]
                }
            }
        })

        return NextResponse.json(server);
    } catch (error) {
        console.log('[SERVER_ID] ERROR: ', error)
        return new NextResponse('Internal error', {status: 500})
    }
}
