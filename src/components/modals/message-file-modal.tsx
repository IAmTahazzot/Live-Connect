'use client'

import * as z from 'zod'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormItem
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useEffect, useState} from "react";
import FileUpload from "@/components/file-upload";
import axios from "axios";
import {useRouter} from "next/navigation";
import {MODAL_TYPES, useModal} from "@/hooks/use-modal-store";
import qs from "query-string";


const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: "Attachment is required."
    })
});

const MessageFileModal = () => {
    const { isOpen, close, type, data } = useModal();
    const router = useRouter()
    const { apiUrl, query } = data

    const isModalOpen = isOpen && type === MODAL_TYPES.MESSAGE_FILE

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { fileUrl: '' }
    });

    const handleClose = () => {
        form.reset()
        close()
    }

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || '',
                query
            });

            await axios.post(url, {
               ...values,
               content: values.fileUrl
            })

            form.reset()
            router.refresh()
            close()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black dark:bg-[#313338] dark:text-[#C4C9CE] p-0 overflow-hidden max-w-[440px] rounded-[5px]">
                <DialogHeader className="pt-5 px-4">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Upload file
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-4 px-4">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="fileUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="messageFile"
                                                    value={field.value}
                                                    onChange={field.onChange}/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter className="bg-gray-100 dark:bg-[#2B2D31] px-4 py-3 justify-between">
                            <Button type={'button'} onClick={() => close()} variant={'ghost'} className={'rounded-[3px] px-6 hover:bg-transparent'}>
                                Back
                            </Button>
                            <Button type={'submit'} variant="primary" className={'rounded-[3px] px-6'} disabled={isLoading}>
                                Upload
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default MessageFileModal