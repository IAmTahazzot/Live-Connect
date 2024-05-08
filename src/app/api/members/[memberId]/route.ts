// 1. Update role of a member
// 2. Kick a member

import {NextResponse} from "next/server";
import {currentProfile} from "@/lib/current-profile";
import {db} from "@/lib/db";

const PATCH = async (
    req: Request,
    { params }: { params: { memberId: string } }
) => {
    try {
        const profile = await currentProfile()
        const { role } = await req.json()
        const { searchParams } = new URL(req.url)

        const serverId = searchParams.get('serverId')

        if (!profile ) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!serverId ) {
            return new NextResponse('Missing serverId', { status: 400 })
        }

        if (!params.memberId) {
            return new NextResponse('Missing memberId', { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },

                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: 'asc'
                    }
                }
            }
        })

        return NextResponse.json(server);
    } catch (error ) {
        return new NextResponse('Unable to update member role', { status: 500 })
    }
}

const DELETE = async (
    req: Request,
    { params }: { params: { memberId: string } }
) => {
    const profile = await currentProfile()

    if (!profile ) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.memberId) {
        return new NextResponse('Missing memberId', { status: 400 })
    }

    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')

    if (!serverId ) {
        return new NextResponse('Missing serverId', { status: 400 })
    }

    try {
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    }
                },
            },
        });

        return NextResponse.json(server);
    } catch (error ) {
        return new NextResponse('Unable to kick member', { status: 500 })
    }
}

export {
    PATCH,
    DELETE
}
