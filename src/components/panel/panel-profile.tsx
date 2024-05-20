'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Profile } from '@prisma/client'
import { useEffect, useState } from 'react'
import { Hash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import { z } from 'zod'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'

const profileFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Just a bit longer.' })
    .max(32, { message: 'Well, Consider using short name please.' }),
  bio: z.string().max(160, { message: 'Bio must be at most 160 characters long.' }),
})

export const PanelProfile = () => {
  const [user, setUser] = useState<Profile>()

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      bio: '',
    },
  })

  useEffect(() => {
    const getUser = async () => {
      const data = await fetch('/api/users/', {
        method: 'GET',
      })

      const response = await data.json()

      if (response.status === 401) {
        alert('Unauthorized')
        return
      }

      const user = response.body.data

      form.setValue('name', user.name || '')
      form.setValue('bio', user.bio || '')

      setUser(user)
    }

    getUser()
  }, [])

  useEffect(() => {
    const bioDOM = document.querySelector('textarea')

    if (bioDOM) {
      bioDOM.style.height = 'auto'
      const height = bioDOM.scrollHeight
      bioDOM.style.height = `${height < 64 ? 64 : height}px`
    }
  }, [user])

  const onSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      const response = await fetch('/api/users/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.status === 401) {
        toast.error('Unauthorized')
        return
      }

      if (response.status === 200) {
        toast.success('Profile updated successfully', {
          position: 'bottom-right',
        })
      }
    } catch (error) {
      alert('An error occurred, please refresh the page or try again later.')
    }
  }

  if (!user) {
    return null
  }

  return (
    <div>
      <h1 className="text-[20px] font-semibold mb-4">Profile</h1>
      <div className="grid grid-cols-2 gap-x-4">
        <div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <h2 className="uppercase font-semibold text-gray-400 text-xs tracking-wide mb-2">Name</h2>
            <input
              type="text"
              {...form.register('name')}
              className="w-full p-[10px] rounded-[3px] bg-[hsl(var(--background-deep-dark))] text-white"
            />
            <span className="text-red-500 text-xs">{form.formState.errors.name?.message}</span>

            <div className="h-[1px] bg-[#41444a] my-6"></div>

            <h2 className="uppercase font-semibold text-gray-400 text-xs tracking-wide mb-2">Bio</h2>
            <textarea
              {...form.register('bio')}
              onInput={e => {
                // auto grow textarea
                const textarea = e.target as HTMLTextAreaElement
                textarea.style.height = 'auto'
                const height = textarea.scrollHeight
                textarea.style.height = `${height < 64 ? 64 : height}px`
              }}
              className="w-full min-h-[64px] p-[10px] rounded-[3px] bg-[hsl(var(--background-deep-dark))] text-white resize-none"></textarea>
            <span className="text-red-500 text-xs font-medium">{form.formState.errors.bio?.message}</span>

            <button className="flex justify-center items-center px-4 text-sm font-medium bg-[#5865f2] hover:bg-[#505bd8] text-white rounded-[3px] h-10 w-[120px] mt-4">
              {form.formState.isSubmitting ? <div className="loader"></div> : 'Save'}
            </button>
          </form>
        </div>
        <div>
          <h2 className="uppercase font-semibold text-gray-400 text-xs tracking-wide mb-2">Preview</h2>

          <div className="bg-[#232428] rounded-md overflow-hidden mb-16" id="profilePreview">
            <div className="bg-[#111214] h-[60px]"></div>

            <div className="px-4">
              <div className="flex justify-between items-center">
                <div className="relative h-24 w-24 rounded-full overflow-hidden border-[6px] border-solid border-[#232428] -translate-y-12">
                  <Image src={user.imageUrl} alt="User profile" fill priority={true} className="object-cover" />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="-translate-y-6">
                      <div className="bg-[#111214] p-[6px] rounded-md">
                        <div className="bg-emerald-500 h-4 w-4 rounded-full flex items-center justify-center">
                          <Hash size={12} className="text-black" />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{user.userId}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="bg-[#111214] rounded-[6px] p-4 mb-6">
                <h2 className="text-[20px] font-semibold mb-1">{form.watch('name')}</h2>
                <p className="text-sm">{user.username}</p>

                <div className="h-[1px] bg-[#2a2c30] my-6"></div>

                <h2 className="uppercase font-bold text-xs tracking-wider mt-6 mb-1">Bio</h2>
                <p className="whitespace-pre-wrap">{form.watch('bio') || ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
