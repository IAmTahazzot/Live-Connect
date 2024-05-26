'use client'

import { useEffect, useState } from 'react'
import { ServerFooter } from '../server/server-footer'
import { Profile } from '@prisma/client'
import { ScrollArea } from '../ui/scroll-area'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { toast } from 'sonner'

type UserSidebarProps = {
  profile: Profile
  conversations: {
    id: string
    recipient: Profile
  }[]
}

export const UserSidebar = ({ profile, conversations }: UserSidebarProps) => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) {
    return '...'
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sitcky top-0 grid place-items-center shrink-0 h-12 p-2 slight-shadow">
        <button className="w-full flex items-center justify-items-center rounded-sm bg-[hsl(var(--background-deep-dark))] text-[#9aa4ac] p-2 h-7 outline-0 text-sm">
          Find or start a conversation
        </button>
      </div>

      <ScrollArea className="flex-1 p-2">
        <SidebarItem
          imageOrIcon={
            <svg
              aria-hidden="true"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24">
              <path fill="currentColor" d="M13 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
              <path
                fill="currentColor"
                d="M3 5v-.75C3 3.56 3.56 3 4.25 3s1.24.56 1.33 1.25C6.12 8.65 9.46 12 13 12h1a8 8 0 0 1 8 8 2 2 0 0 1-2 2 .21.21 0 0 1-.2-.15 7.65 7.65 0 0 0-1.32-2.3c-.15-.2-.42-.06-.39.17l.25 2c.02.15-.1.28-.25.28H9a2 2 0 0 1-2-2v-2.22c0-1.57-.67-3.05-1.53-4.37A15.85 15.85 0 0 1 3 5Z"></path>
            </svg>
          }
          label={'Friends'}
          href={'/me'}
        />

        <h3 className="mt-6 mb-3 font-sans text-[11px] text-[#949ba4] uppercase tracking-wider px-2 font-medium">
          Your conversations
        </h3>

        {conversations.length > 0 ? (
          conversations.map(conversation => {
            return (
              <SidebarItem
                key={conversation.id}
                imageOrIcon={conversation.recipient.imageUrl}
                label={conversation.recipient.name}
                href={'/me/' + conversation.id}
                conversationId={conversation.id}
              />
            )
          })
        ) : (
          <Loader clone={14} />
        )}
      </ScrollArea>

      <ServerFooter profile={profile} />
    </div>
  )
}

const SidebarItem = ({
  imageOrIcon,
  label,
  href,
  conversationId,
}: {
  imageOrIcon: string | React.ReactNode
  label: string
  href: string
  conversationId?: string
}) => {
  const [deleting, setDeleting] = useState(false)
  const pathName = usePathname()
  const router = useRouter()

  const deleteConversation = (conversationId: string) => {
    toast.warning('Delete conversation?', {
      action: {
        label: 'delete',
        onClick: async () => {
          // delete the conversation

          try {
            setDeleting(true)
            const req = await fetch('/api/conversation', {
              method: 'DELETE',
              body: JSON.stringify({ conversationId }),
            })

            if (!req.ok) {
              return toast.error('Failed to delete conversation', { duration: 2000 })
            }

            toast.success('Conversation deleted of ID: ' + conversationId, { duration: 2000 })
            router.push('/me')
            router.refresh()
          } catch (error) {
            return toast.error('Failed to delete conversation', { duration: 2000 })
          } finally {
            setDeleting(false)
          }
        },
      },
    })
  }

  const createVisual =
    typeof imageOrIcon === 'string' ? (
      <Image src={imageOrIcon} width={24} height={24} alt={label} priority={true} className="rounded-full" />
    ) : (
      imageOrIcon
    )

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-sm px-3 py-[10px] bg-transparent hover:bg-[hsl(var(--background-modifier-selected)/.3)] cursor-pointer relative group',
        href === pathName && 'bg-[hsl(var(--background-modifier-selected)/.6)]'
      )}>
      {createVisual}
      <span>{label}</span>

      {conversationId && (
        <div
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md cursor-pointer"
          onClick={() => deleteConversation(conversationId)}>
          {deleting ? (
            <div className="loader -translate-x-4"></div>
          ) : (
            <X size={18} className="group-hover:block hidden opacity-70" />
          )}
        </div>
      )}
    </Link>
  )
}

export const Loader = ({ clone = 1 }: { clone?: number }) => {
  const opacity = 1

  return Array.from({ length: clone }).map((_, i) => (
    <div
      key={i}
      className={cn('flex items-center gap-2 p-2', i < 4 && 'animate-pulse')}
      style={{
        opacity: opacity - i * 0.1,
      }}>
      <div className={`w-8 h-8 shrink-0 rounded-full bg-[hsl(var(--background-modifier-selected)/.3)]`}></div>
      <div className={`w-8/12 h-5 rounded-full bg-[hsl(var(--background-modifier-selected)/.3)]`}></div>
    </div>
  ))
}
