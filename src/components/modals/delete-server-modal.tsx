'use client'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogHeader,
    DialogFooter
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {MODAL_TYPES, useModal} from "@/hooks/use-modal-store";
import { AiOutlineLoading} from "react-icons/ai";
import axios from "axios";

const DeleteServer = () => {
    const { isOpen, close, type, data } = useModal()
    const router = useRouter()
    const server = data?.server

    const isModalOpen = isOpen && type === MODAL_TYPES.DELETE_SERVER
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    } ,[])

    if (!mounted) return null

    const handleClose = () => {
        close()
    }

    const deleteServer = async () => {
        setLoading(true)

        try {
            await axios.delete(`/api/servers/${server?.id}`)
            close()
            router.refresh()
            router.push('/')
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black dark:bg-[#313338] dark:text-[#C4C9CE] p-0 overflow-hidden w-[95%] sm:max-w-[440px] rounded-[5px]">
                <DialogHeader className="pt-5 px-4">
                    <DialogTitle className="text-2xl dark:text-slate-200 text-center font-medium">
                       Caution!
                    </DialogTitle>
                </DialogHeader>
                <div className={'p-4'}>
                    Delete <span className={'text-[--color-primary] font-bold'}>{server?.name}</span> server?
                </div>
                <DialogFooter className="bg-gray-100 dark:bg-[#2B2D31] px-4 py-3 justify-between">
                    <Button type={'button'} onClick={() => close() }  variant={'ghost'} className={'rounded-[3px] px-6 hover:bg-transparent'}>
                        Back safely
                    </Button>
                    <Button
                        onClick={() => deleteServer()}
                        type={'button'} variant="destructive" className={'rounded-[3px] px-6'} disabled={loading}>
                        {
                            loading ? (
                                <span className={'ml-2'}>
                                    <AiOutlineLoading className={'animate-spin'} />
                                </span>
                            ) : 'Delete'
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteServer
