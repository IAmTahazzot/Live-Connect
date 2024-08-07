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

const formSchema = z.object({
    name: z.string().min(1, 'Server name is required').max(32, 'Server name must be less than 32 characters'),
    imageUrl: z.string().optional()
});

const EditServerModal = () => {
    const { isOpen, close, type, data } = useModal()
    const router = useRouter()
    const { server } = data;

    const isModalOpen = isOpen && type === MODAL_TYPES.EDIT_SERVER

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: 'Update Server', imageUrl: '' }
    });


    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/servers/${server?.id}`, {
                name: values.name,
                imageUrl: values.imageUrl
            })
            form.reset()
            router.refresh()
            close()
        } catch (error) {
            console.log(error)
        }
    }
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    } ,[])

    useEffect(() => {
        if (server) {
            form.setValue('name', server.name)
            form.setValue('imageUrl', server.imageUrl)
        }
    }, [ server, form]);

    useEffect(() => { form.setFocus('name'); }, [form]);

    if (!mounted) return null

    const handleClose = () => {
        close()
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:bg-[var(--background-chat)] text-black p-0 overflow-hidden w-[95%] sm:max-w-[440px] rounded-[5px]">
                <DialogHeader className="pt-5 px-4">
                    <DialogTitle className="text-2xl text-center font-bold dark:text-zinc-200">
                        Update your server
                    </DialogTitle>
                    <DialogDescription className="text-center text-base text-zinc-600 dark:text-zinc-200">
                        Give your server a personality with a name and an image. You can always change it later.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-4 px-4">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="serverImage"
                                                    value={field.value}
                                                    onChange={field.onChange}/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70 dark:text-zin" >
                                            Server name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-input rounded-[3px] border-0 focus-visible:ring-0 text-zinc-700 focus-visible:ring-offset-0 font-medium text-base dark:text-zinc-300 dark:placeholder:text-zinc-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <p className={'text-[11px] font-sans'}>
                                            <span className={'text-zinc-600 dark:text-zinc-400'}>By creating a server, you agree to Discord&apos;s </span>
                                            <Link href={'/'} className={'text-sky-500 font-[600]'}>
                                                Community Guidelines
                                            </Link>
                                        </p>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 dark:bg-[var(--background-chat)] px-4 py-3 justify-between">
                            <Button type={'button'} onClick={() => close() }  variant={'ghost'} className={'rounded-[3px] px-6 hover:bg-transparent hover:text-black dark:text-zinc-200 dark:hover:text-zinc-300'}>
                                Back
                            </Button>
                            <Button type={'submit'} variant="primary" className={'rounded-[3px] px-6'} disabled={isLoading}>
                               Update
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditServerModal
