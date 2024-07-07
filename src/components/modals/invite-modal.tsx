'use client'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogHeader
} from "@/components/ui/dialog";


import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import { useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
import {MODAL_TYPES, useModal} from "@/hooks/use-modal-store";
import {Label} from "@/components/ui/label";
import {Check, Copy, RefreshCw} from 'lucide-react';
import {useOrigin} from "@/hooks/use-origin";
import {cn} from "@/lib/utils";

const InviteModal = () => {
    const origin = useOrigin()

    const [copied, setCopied] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const { isOpen, close, type, onOpen, data } = useModal()
    const { server } = data;

    const isModalOpen = isOpen && type === MODAL_TYPES.INVITE
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl).then(r => {
            setCopied(true);
        });

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const onNew = async () => {
        try {
            setLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

            onOpen(MODAL_TYPES.INVITE, { server: response.data });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={close}>
            <DialogContent className="bg-white text-black dark:bg-[--background-sidebar] dark:text-[#C4C9CE] p-0 overflow-hidden w-[95%] sm:max-w-[440px] rounded-[5px]">
                <DialogHeader className="pt-5 px-4">
                    <DialogTitle className="text-2xl text-center font-bold dark:text-[#f2f3f5]">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-medium" >
                        Server invite link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            disabled={loading}
                            className="bg-zinc-300/50 dark:bg-[#1e1f22] dark:text-[#f2f3f5] border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 rounded-[3px]"
                            value={inviteUrl}
                            readOnly={true}
                        />
                        <Button disabled={loading}
                                onClick={onCopy}
                                size="icon"
                                className={cn('bg-[--color-primary] hover:bg-[--color-primary-hover] text-white w-[80px] rounded-[3px]', copied && 'bg-emerald-800 hover:bg-emerald-800')}>
                            {copied
                                ? <span>Copied</span>
                                : <span>Copy</span>
                            }
                        </Button>
                    </div>

                    <Button
                        onClick={onNew}
                        disabled={loading}
                        variant="link"
                        size="sm"
                        className="text-xs mt-4 dark:text-[#C4C9CE] pl-0"
                    >
                        <span> Generate a new link </span>
                        <RefreshCw className="w-4 h-4 ml-2" />
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default InviteModal
