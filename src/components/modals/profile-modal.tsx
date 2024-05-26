'use client'

import { useEffect, useState } from 'react'
import { MODAL_TYPES, useModal } from '@/hooks/use-modal-store'
import Image from 'next/image'
import { Member, Profile } from '@prisma/client'
import { TooltipProvider, TooltipTrigger, TooltipContent, Tooltip } from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export const ProfileModal = () => {
  const { isOpen, close, type, data } = useModal()
  const isModalOpen = isOpen && type === MODAL_TYPES.PROFILE
  const [gettingConversationId, setGettingConversationId] = useState(false)
  const router = useRouter()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isModalOpen || !data) return null

  const { profile, currentUserId, requestForbidden } = data as {
    profile: Profile
    currentUserId: string
    requestForbidden?: boolean
  }

  const memberSince = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(profile.createdAt))

  const initiateConversation = async () => {
    // FEAT: Can be improved by checking if both parties have a conversation already then just redirect to the existing conversation without making any request... (IMPROVEMENT)
    try {
      setGettingConversationId(true)

      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationFrom: currentUserId,
          conversationTo: profile.id,
        }),
      })

      const { conversationId } = await response.json()

      if (conversationId) {
        router.push(`/me/${conversationId}`)
        router.refresh()
        close()
      }
    } catch (err) {
      toast.error('Failed to initiate conversation')
    } finally {
      setGettingConversationId(false)
    }
  }

  return (
    <div
      className="grid place-items-center fixed top-0 left-0 w-full h-full overflow-y-auto bg-black/75 z-[99]"
      onClick={close}>
      <div
        className="w-[600px] mx-auto rounded-lg bounce-up bg-[#111214] overflow-hidden"
        id="profileModal"
        onClick={e => {
          e.stopPropagation()
        }}>
        <div
          className="empty-space-for-style bg-[#222427] h-[200px] p-4 flex justify-end items-start"
          style={{
            backgroundColor: `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`,
          }}>
          {!requestForbidden && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="outline-0 flex items-center justify-center h-8 w-8 rounded-full bg-black/50">
                    <svg
                      aria-hidden="true"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24">
                      <path
                        d="M19 14a1 1 0 0 1 1 1v3h3a1 1 0 0 1 0 2h-3v3a1 1 0 0 1-2 0v-3h-3a1 1 0 1 1 0-2h3v-3a1 1 0 0 1 1-1Z"
                        fill="currentColor"></path>
                      <path
                        d="M16.83 12.93c.26-.27.26-.75-.08-.92A9.5 9.5 0 0 0 12.47 11h-.94A9.53 9.53 0 0 0 2 20.53c0 .81.66 1.47 1.47 1.47h.22c.24 0 .44-.17.5-.4.29-1.12.84-2.17 1.32-2.91.14-.21.43-.1.4.15l-.26 2.61c-.02.3.2.55.5.55h7.64c.12 0 .17-.31.06-.36C12.82 21.14 12 20.22 12 19a3 3 0 0 1 3-3h.5a.5.5 0 0 0 .5-.5V15c0-.8.31-1.53.83-2.07ZM12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                        fill="currentColor"></path>
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="z-[100]">Add to friends</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <main className="px-4">
          <div className="relative flex items-center justify-end mb-6 mt-4">
            <div className="absolute -top-4 left-0 h-28 w-28 rounded-full bg-black overflow-hidden border-[6px] border-solid border-[#111214] -translate-y-1/2">
              <Image src={profile.imageUrl!} alt={'Profile Picture'} fill className="rounded-full object-cover" />
            </div>

            <div className="relative">
              <button
                className={cn(
                  'flex gap-2 items-center p-2 px-4 rounded-sm bg-[hsl(var(--background-modifier-selected)/.6)] hover:bg-[hsl(var(--background-modifier-selected)/.8)] cursor-pointer transition-colors duration-300'
                )}
                onClick={initiateConversation}>
                <svg
                  aria-hidden="true"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 22a10 10 0 1 0-8.45-4.64c.13.19.11.44-.04.61l-2.06 2.37A1 1 0 0 0 2.2 22H12Z"></path>
                </svg>
                <span>Message</span>
              </button>
              {gettingConversationId && (
                <>
                  <div className="absolute top-0 left-0 w-full h-full bg-[#35373c] rounded-sm"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 loader z-10"></div>
                </>
              )}
            </div>
          </div>

          <h1 className="font-semibold text-2xl">{profile.name}</h1>
          <p className="text-sm">{profile.username}</p>

          <div className="rounded-lg bg-[#222427] p-4 my-4 border-[1px] border-solid border-[#333438] max-h-[250px] overflow-y-auto">
            <div className=" border-b-[1px] border-solid border-[#3d4046]">
              {/* FEAT: Can be used dynamic tabs to display more user info (but it's enough for this prototype) */}
              <button className="outline-0 text-sm py-1 border-b-[1px] border-solid border-white/80 text-[#bcc4cc]">
                About
              </button>
            </div>

            <div className="text-sm py-4">
              <p className="whitespace-pre-line">{profile.bio || 'No bio found!'}</p>

              <br />

              <span className="text-xs py-1 border-b-[1px] text-[#bcc4cc] font-medium"> Member since </span>
              <div className="flex gap-2 items-center mt-1 text-[#bcc4cc]">
                <svg
                  aria-label="Discord"
                  aria-hidden="false"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19.73 4.87a18.2 18.2 0 0 0-4.6-1.44c-.21.4-.4.8-.58 1.21-1.69-.25-3.4-.25-5.1 0-.18-.41-.37-.82-.59-1.2-1.6.27-3.14.75-4.6 1.43A19.04 19.04 0 0 0 .96 17.7a18.43 18.43 0 0 0 5.63 2.87c.46-.62.86-1.28 1.2-1.98-.65-.25-1.29-.55-1.9-.92.17-.12.32-.24.47-.37 3.58 1.7 7.7 1.7 11.28 0l.46.37c-.6.36-1.25.67-1.9.92.35.7.75 1.35 1.2 1.98 2.03-.63 3.94-1.6 5.64-2.87.47-4.87-.78-9.09-3.3-12.83ZM8.3 15.12c-1.1 0-2-1.02-2-2.27 0-1.24.88-2.26 2-2.26s2.02 1.02 2 2.26c0 1.25-.89 2.27-2 2.27Zm7.4 0c-1.1 0-2-1.02-2-2.27 0-1.24.88-2.26 2-2.26s2.02 1.02 2 2.26c0 1.25-.88 2.27-2 2.27Z"></path>
                </svg>
                <span className="text-[13px] text-gray-200">{memberSince}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
