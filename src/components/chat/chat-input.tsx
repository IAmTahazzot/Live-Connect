'use client'

import * as z from 'zod'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Smile } from 'lucide-react'
import { Input } from '@/components/ui/input'
import qs from 'query-string'
import axios from 'axios'
import { MODAL_TYPES, useModal } from '@/hooks/use-modal-store'
import EmojiPicker from '@/components/emoji-picker'

interface ChatInputProps {
  apiUrl: string
  query: Record<string, any>
  name: string
  type: 'conversation' | 'channel'
}

const formSchema = z.object({
  content: z.string().min(1),
} as const)

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      })

      await axios.post(url, data)
      form.reset()

      const inputDOM = document.querySelector('input[name="content"]') as HTMLInputElement
      inputDOM.focus()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name={'content'}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6 flex items-center">
                  <button
                    type="button"
                    onClick={() => onOpen(MODAL_TYPES.MESSAGE_FILE, { apiUrl, query })}
                    className="absolute top-[26px] left-8 h-[24px] w-[24px] text-zinc-500 dark:text-[#b5bac1] hover:text-zinc-600 dark:hover:text-zinc-300 transition rounded-full flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12 2.00098C6.486 2.00098 2 6.48698 2 12.001C2 17.515 6.486 22.001 12 22.001C17.514 22.001 22 17.515 22 12.001C22 6.48698 17.514 2.00098 12 2.00098ZM17 13.001H13V17.001H11V13.001H7V11.001H11V7.00098H13V11.001H17V13.001Z"></path>
                    </svg>
                  </button>
                  <Input
                    disabled={isLoading}
                    className="px-14 bg-zinc-200/90 dark:bg-[#383a40] border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-700 placeholder:text-[#6d6f78] text-[16px] dark:text-[#DBDEE1] h-[44px]"
                    placeholder={`Message ${type === 'conversation' ? name : '#' + name}`}
                    autoComplete={'off'}
                    {...field}
                  />
                  <div className={'absolute top-[26px] right-8'}>
                    <EmojiPicker
                      onChange={value => {
                        form.setValue('content', form.getValues('content') + value)
                      }}
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default ChatInput
