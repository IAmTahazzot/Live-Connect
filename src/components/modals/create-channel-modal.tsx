'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import qs from 'query-string'
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormLabel, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { MODAL_TYPES, useModal } from '@/hooks/use-modal-store'
import { ChannelType } from '@prisma/client'
import { Hash, MicIcon, VideoIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Channel name is required',
    })
    .max(32, 'Channel name must be less than 32 characters'),
  type: z.nativeEnum(ChannelType),
})

const CreateChannelModal = () => {
  const { isOpen, close, type, data } = useModal()
  const router = useRouter()
  const params = useParams()
  const { channelType } = data

  const isModalOpen = isOpen && type === MODAL_TYPES.CREATE_CHANNEL

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: 'channel name', type: channelType || ChannelType.TEXT },
  })

  useEffect(() => {
    if (channelType) {
      form.setValue('type', channelType)
    } else {
      form.setValue('type', ChannelType.TEXT)
    }
  }, [channelType, form])

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: '/api/channels',
        query: {
          serverId: params?.serverId,
        },
      })

      await axios.post(url, values as any)

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
  }, [])

  useEffect(() => {
    form.setFocus('name')
  }, [form])
  if (!mounted) return null

  const handleClose = () => {
    form.reset()
    close()
  }

  const renderRadioCircle = (selected: boolean) => {
    return (
      <svg aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          fill="currentColor"></path>
        {selected && <circle cx="12" cy="12" r="5" fill="currentColor"></circle>}
      </svg>
    )
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black dark:bg-[#313338] dark:text-[#C4C9CE] p-0 overflow-hidden max-w-[450px] rounded-[5px]">
        <DialogHeader className="pt-5 px-4">
          <DialogTitle className="text-2xl dark:text-slate-200 font-medium">Create a Channel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 px-4">
              <div className="space-y-2">
                <div
                  className={cn(
                    'grid grid-cols-[40px_1fr_40px] items-center justify-items-center dark:bg-[#2b2d31] dark:hover:bg-[#3c3e44b9] rounded-sm p-2 select-none cursor-pointer',
                    form.watch('type') === ChannelType.TEXT && 'dark:bg-[#4e505899]'
                  )}
                  onClick={() => {
                    form.setValue('type', ChannelType.TEXT)
                  }}>
                  <Hash size={20} className="text-white dark:text-white" />
                  <div className="justify-self-start pl-1">
                    <h3 className="text-white">Text</h3>
                    <p className="text-sm text-ellipsis whitespace-nowrap overflow-hidden">
                      Send messages, images, GIFs, emoji, opinions and puns
                    </p>
                  </div>
                  <div>{renderRadioCircle(form.watch('type') === ChannelType.TEXT)}</div>
                </div>
                <div
                  className={cn(
                    'grid grid-cols-[40px_1fr_40px] items-center justify-items-center dark:bg-[#2b2d31] dark:hover:bg-[#3c3e44b9] rounded-sm p-2 select-none cursor-pointer',
                    form.watch('type') === ChannelType.AUDIO && 'dark:bg-[#4e505899]'
                  )}
                  onClick={() => {
                    form.setValue('type', ChannelType.AUDIO)
                  }}>
                  <MicIcon size={20} className="text-white dark:text-white" />
                  <div className="justify-self-start pl-1">
                    <h3 className="text-white">Voice</h3>
                    <p className="text-sm text-ellipsis whitespace-nowrap overflow-hidden">
                      Hang out together with voice, video and screen sharing
                    </p>
                  </div>
                  <div>{renderRadioCircle(form.watch('type') === ChannelType.AUDIO)}</div>
                </div>
                <div
                  className={cn(
                    'grid grid-cols-[40px_1fr_40px] items-center justify-items-center dark:bg-[#2b2d31] dark:hover:bg-[#3c3e44b9] rounded-sm p-2 select-none cursor-pointer',
                    form.watch('type') === ChannelType.VIDEO && 'dark:bg-[#4e505899]'
                  )}
                  onClick={() => {
                    form.setValue('type', ChannelType.VIDEO)
                  }}>
                  <VideoIcon size={20} className="text-white dark:text-white" />
                  <div className="justify-self-start pl-1">
                    <h3 className="text-white">Video</h3>
                    <p className="text-sm text-ellipsis whitespace-nowrap overflow-hidden">
                      Face time with your friends, family and colleagues
                    </p>
                  </div>
                  <div>{renderRadioCircle(form.watch('type') === ChannelType.VIDEO)}</div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-semibold text-zinc-500 dark:text-slate-200">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-input dark:bg-[#1e1f22] rounded-[3px] border-0 focus-visible:ring-0 text-zinc-700 dark:text-slate-300 focus-visible:ring-offset-0 font-medium text-base lowercase"
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
              <Button
                type={'button'}
                onClick={() => close()}
                variant={'ghost'}
                className={'rounded-[3px] px-6 hover:bg-transparent'}>
                Back
              </Button>
              <Button
                type={'submit'}
                variant="primary"
                className={'rounded-[3px] px-6 bg-[--color-primary]'}
                disabled={isLoading}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateChannelModal
