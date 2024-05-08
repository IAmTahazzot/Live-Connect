'use client'

import * as z from 'zod'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import qs from 'query-string'

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
    FormItem, FormMessage
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import axios from "axios";
import {useParams, useRouter} from "next/navigation";
import {MODAL_TYPES, useModal} from "@/hooks/use-modal-store";
import {ChannelType} from "@prisma/client";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Channel name is required'
    }).max(32, 'Channel name must be less than 32 characters'),
    type: z.nativeEnum(ChannelType)
});

const EditChannelModal = () => {
    const { isOpen, close, type, data } = useModal()
    const router = useRouter()
    const params = useParams()
    const { channel, server } = data

    const isModalOpen = isOpen && type === MODAL_TYPES.EDIT_CHANNEL

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: 'Channel Name', type: channel?.type ||  ChannelType.TEXT },
    });

    useEffect(() => {
        if (channel) {
            form.setValue('name', channel.name)
            form.setValue('type', channel.type)
        }
    }, [form, channel]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: '/api/channels/' + channel?.id,
                query: {
                    serverId: server?.id
                }
            })

            await axios.patch(url, values as any)

            form.reset()
            router.refresh()
            close()
        } catch (e) {
            console.error(e)
        }
    }

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    } ,[])

    useEffect(() => {
            form.setFocus('name'); },
        [form]);
    if (!mounted) return null

    const handleClose = () => {
        form.reset()
        close()
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black dark:bg-[#313338] dark:text-[#C4C9CE] p-0 overflow-hidden max-w-[440px] rounded-[5px]">
                <DialogHeader className="pt-5 px-4">
                    <DialogTitle className="text-2xl dark:text-slate-200 text-center font-medium">
                        Edit Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-4 px-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Channel Type</FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className="bg-zinc-300 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                                >
                                                    <SelectValue placeholder="Select a channel type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                        className="capitalize"
                                                    >
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-semibold text-zinc-500 dark:text-slate-200" > Channel Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-input dark:bg-[#1e1f22] rounded-[3px] border-0 focus-visible:ring-0 text-zinc-700 dark:text-slate-300 focus-visible:ring-offset-0 font-medium text-base"
                                                {...field}
                                            />
                                        </FormControl>

                                        {form.formState.errors.name && (
                                            <p className="font-medium text-rose-500 text-xs mt-1"> {form.formState.errors.name.message} </p>
                                        )}
                                        <p className={'text-[11px] font-sans'}>
                                            <span className={'text-zinc-600 dark:text-zinc-400'}>
                                                Don&apos;t spam or post NSFW content. I can see you and I will find you :)
                                            </span>
                                        </p>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 dark:bg-[#2B2D31] px-4 py-3 justify-between">
                            <Button type={'button'} onClick={() => close() }  variant={'ghost'} className={'rounded-[3px] px-6 hover:bg-transparent'}>
                                Back
                            </Button>
                            <Button type={'submit'} variant="primary" className={'rounded-[3px] px-6 bg-[--color-primary]'} disabled={isLoading}>
                                Update
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditChannelModal
