'use client'

import {useState} from "react";

import {MODAL_TYPES, useModal} from "@/hooks/use-modal-store";
import {Member, MemberRole, Profile, Server} from "@prisma/client";
import {BsThreeDotsVertical, BsCheckLg} from "react-icons/bs";
import {RiShieldStarFill, RiShieldFill} from "react-icons/ri";
import { AiOutlineLoading, AiOutlineUser } from "react-icons/ai";
import { TbUserShield} from "react-icons/tb";
import { GiHighKick} from "react-icons/gi";
import qs from 'query-string'

import {ScrollArea} from "@/components/ui/scroll-area";
import {UserAvatar} from "@/components/user-avatar";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSub, DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogHeader
} from "@/components/ui/dialog";
import axios from "axios";
import {useRouter} from "next/navigation";

const MEMBERS_ROLE_ICONS = {
    GUEST: null,
    MODERATOR: <RiShieldFill className={'h-4 w-4'}/>,
    ADMIN: <RiShieldStarFill className={'h-4 w-4 text-purple-500'}/>
}

const MembersModal = () => {
    const router = useRouter()
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const {isOpen, close, type, onOpen, data} = useModal()
    const {server} = data as {
        server: Server & {
            members: (Member & { profile: Profile })[]
        },
    };
    const isModalOpen = isOpen && type === MODAL_TYPES.MEMBERS
    const MEMBERS_COUNT: number = server?.members?.length


    const updateRole = async (memberId: string, role: MemberRole) => {
        setLoadingId(memberId)
        try {
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                }
            })

            const response = await axios.patch(url, {role}) as { data: Member }

            router.refresh()
            onOpen(MODAL_TYPES.MEMBERS, {server: response.data as any})
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingId(null)
        }
    }

    const deleteMember = async (memberId: string) => {
        setLoadingId(memberId)
        try {
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                }
            })

            const response = await axios.delete(url)

            router.refresh()
            onOpen(MODAL_TYPES.MEMBERS, {server: response.data as any})
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={close}>
            <DialogContent
                className="bg-white text-black dark:bg-[--background-sidebar] dark:text-[#C4C9CE] p-0 overflow-hidden w-[95%] sm:max-w-[440px] rounded-[5px]">
                <DialogHeader className="pt-5 px-4">
                    <DialogTitle className="text-2xl text-center font-bold dark:text-[#f2f3f5]">
                        Manage Members
                    </DialogTitle>
                    <div className={'flex items-center justify-center gap-2'}>
                        <div className={'h-2 w-2 rounded-full bg-zinc-700'}></div>
                        <span className={'dark:text-[#C4C9CE]'}>{MEMBERS_COUNT} Member{MEMBERS_COUNT > 1 && 's'} </span>
                    </div>
                </DialogHeader>

                <ScrollArea className="mt-8 max-h-[420px] pr-6 mx-4">
                    {server?.members?.map((member) => (
                        <div key={member.id} className={'flex items-center gap-x-2 mb-6'}>
                            <UserAvatar src={member.profile.imageUrl}/>
                            <div className={'flex items-center gap-x-2'}>
                                <span className={'font-medium'}>{member.profile.name}</span>
                                <span>{MEMBERS_ROLE_ICONS[member.role]}</span>
                            </div>
                            {
                                loadingId === member.id ? (
                                    <div className={'ml-auto'}>
                                        <AiOutlineLoading className={'animate-spin h-4 w-4'} />
                                    </div>
                                ) : (
                                    <div className={'ml-auto'}>
                                        {
                                            member.role !== MemberRole.ADMIN && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <BsThreeDotsVertical className={'h-4 w-4 '}/>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent className={'max-w-[400px] dark:bg-[--background-sidebar]'}
                                                                         side={'left'}>
                                                        <DropdownMenuSub>
                                                            <DropdownMenuSubTrigger className={''}>
                                                                 <div className={'flex items-center gap-x-2 font-medium'}>
                                                                     <TbUserShield className={'w-4 h-4'}/>
                                                                     <span>Role</span>
                                                                 </div>
                                                            </DropdownMenuSubTrigger>
                                                            <DropdownMenuSubContent>
                                                                <DropdownMenuItem
                                                                    onClick={() => updateRole(member.id, MemberRole.GUEST)}
                                                                    className={'flex items-center gap-x-1'}
                                                                    disabled={member.role === MemberRole.GUEST}
                                                                >
                                                                    <AiOutlineUser className={'w-4 h-4'}/>
                                                                    <span>Guest</span>
                                                                    { member.role === MemberRole.GUEST && <BsCheckLg className={'h-4 w-4 text-green-700'}/> }
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => updateRole(member.id, MemberRole.MODERATOR)}
                                                                    className={'flex items-center gap-x-1'}
                                                                    disabled={member.role === MemberRole.MODERATOR}
                                                                >
                                                                    {MEMBERS_ROLE_ICONS.MODERATOR}
                                                                    <span>Moderator</span>
                                                                    { member.role === MemberRole.MODERATOR && <BsCheckLg className={'h-4 w-4 text-green-700'}/> }
                                                                </DropdownMenuItem>
                                                            </DropdownMenuSubContent>
                                                        </DropdownMenuSub>


                                                        <DropdownMenuItem className={'text-rose-500 dark:hover:bg-rose-500 dark:hover:text-zinc-200'}
                                                            onClick={() => deleteMember(member.id)}>
                                                            <div className={'flex items-center gap-x-2 font-medium'}>
                                                                <GiHighKick className={'w-4 h-4'}/>
                                                                <span>Kick</span>
                                                            </div>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export default MembersModal