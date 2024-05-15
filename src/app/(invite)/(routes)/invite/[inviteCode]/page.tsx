import {currentProfile} from "@/lib/current-profile";
import {Metadata} from "next";
import Link from "next/link";
import {db} from "@/lib/db";
import Image from "next/image";
import React  from "react";
import JoinButton from "@/app/(invite)/components/joinButton";

export const metadata: Metadata = {
    title: 'Invite',
}

interface InviteProps {
    params: {
        inviteCode: string
    }
}

const Invite = async ({params}: InviteProps) => {
    const profile = await currentProfile();

    const server = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
        },
        include: {
            members: {}
        }
    } as any);


    if (!server) {
        return (
            <div className={'flex items-center justify-center h-screen'}>
                <div className={'flex flex-col gap-2 items-center'}>
                    <p className={'m'}>Invalid invite code</p>
                    <Link href={'/'} className={'py-2 px-4 bg-zinc-900 hover:bg-black transition text-white rounded-[6px] mt-4'}>Go home</Link>
                </div>
            </div>
        )
    }

    // if user is already in the server then just redirect them to the server
    const existingServer = profile ? await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    }) : false;


    return (
        <div>
            <div>
                <div className="bg h-screen w-full -z-0 fixed top-0 left-0">
                    <Image src={'/assets/invite-bg.svg'} alt={'invite-playful-background'} fill className={'object-fit'} />
                </div>
                <div className="content relative z-1 h-screen w-full flex items-center justify-center">
                    <div className={'w-full lg:w-[480px] lg:rounded-md bg-[--background-sidebar] p-8'}>
                        <div className={'w-[68px] h-[68px] rounded-full mx-auto relative overflow-hidden'}>
                            {
                                server.imageUrl ? (
                                    <Image src={server.imageUrl} alt={server.name} fill className={'object-fit'} />
                                ) : (
                                    <div className={'bg-[--color-primary] text-white h-full w-full flex items-center justify-center font-medium text-[20px]     '}>
                                        {server.name.split(' ').slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('')}
                                    </div>
                                )
                            }
                        </div>
                        <h3 className={'text-center font-bold text-[20px] mt-1'}>{server.name}</h3>
                        <div className={'flex items-center justify-center gap-2'}>
                            <div className="circle h-[8px] w-[8px] rounded-[4px] bg-slate-500"></div>
                            {/* @ts-ignore */}
                            <span>{server.members.length} Members</span>
                        </div>

                        <div className={'mt-8'}>
                            {
                                profile ? (
                                    existingServer ? (
                                        <Link href={'/servers/' + server.id} className={'bg-[--color-primary] hover:bg-[--color-primary-hover] transition-colors font-medium  rounded-[4px] text-white h-[44px] w-full flex items-center justify-center'}>
                                            Open
                                        </Link>
                                    ) : (
                                        <JoinButton inviteCode={params.inviteCode} />
                                    )
                                ) : (
                                    <Link href={'/sign-up'} className={'bg-[--color-primary] hover:bg-[--color-primary-hover] transition-colors font-medium  rounded-[4px] text-white h-[44px] w-full flex items-center justify-center'}>
                                        Login to join the server
                                    </Link>
                                )
                            }
                        </div>
                        <p className={'mt-2 text-[12px] text-zinc-400'}>Just be kind and polite & Chill :)</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Invite