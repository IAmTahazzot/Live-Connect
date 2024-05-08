'use client'

import { Member, MemberRole, Profile, Server } from '@prisma/client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'
import { BsFillPersonPlusFill } from 'react-icons/bs'
import { RiSettings5Fill } from 'react-icons/ri'
import { BiSolidPlusCircle } from 'react-icons/bi'
import { IoPeopleCircle } from 'react-icons/io5'
import { BsTrash2Fill } from 'react-icons/bs'
import { HiChevronDown } from 'react-icons/hi'

import { MODAL_TYPES, useModal } from '@/hooks/use-modal-store'

interface ServerHeaderProps {
  server: Server & {
    members: (Member & { profile: Profile })[]
  }
  role?: MemberRole
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal()

  const isAdmin = role === MemberRole.ADMIN
  const isModerator = isAdmin || role === MemberRole.MODERATOR

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-[hsl(var(--background-modifier-selected)/.3)] transition">
            {server.name}
            <HiChevronDown className="h-5 w-5 ml-auto" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-[#B5BAC1] space-y-[2px] dark:bg-[#111214]">
          {isModerator && (
            <DropdownMenuItem
              onClick={() => onOpen(MODAL_TYPES.INVITE, { server })}
              className="text-[#949CF7] hover:bg-[--color-primary] dark:hover:bg-[--color-primary] hover:text-white dark:hover:text-white dark:text-[#949CF7] px-3 py-2 text-sm cursor-pointer font-medium">
              Invite People
              <BsFillPersonPlusFill className="h-[18px] w-[18px] ml-auto" />
            </DropdownMenuItem>
          )}

          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen(MODAL_TYPES.EDIT_SERVER, { server })}
              className="text-slate-700 hover:bg-[--color-primary] dark:hover:bg-[--color-primary] hover:text-white dark:hover:text-white dark:text-[#B5BAC1] px-3 py-2 text-sm cursor-pointer font-medium">
              Server Settings
              <RiSettings5Fill className="h-5 w-5 ml-auto" />
            </DropdownMenuItem>
          )}

          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen(MODAL_TYPES.MEMBERS, { server })}
              className="text-slate-700 hover:bg-[--color-primary] dark:hover:bg-[--color-primary] hover:text-white dark:hover:text-white dark:text-[#B5BAC1] px-3 py-2 text-sm cursor-pointer font-medium">
              Members
              {/*<Users className="h-4 w-4 ml-auto" />*/}
              <IoPeopleCircle className="h-5 w-5 ml-auto" />
            </DropdownMenuItem>
          )}
          {isModerator && (
            <DropdownMenuItem
              onClick={() => onOpen(MODAL_TYPES.CREATE_CHANNEL)}
              className="text-slate-700 hover:bg-[--color-primary] dark:hover:bg-[--color-primary] hover:text-white dark:hover:text-white dark:text-[#B5BAC1] px-3 py-2 text-sm cursor-pointer font-medium">
              Create Channel
              {/*<PlusCircle className="h-4 w-4 ml-auto" />*/}
              <BiSolidPlusCircle className="h-5 w-5 ml-auto" />
            </DropdownMenuItem>
          )}
          {isModerator && <hr className={'w-[90%] mx-auto my-6 text-slate-700'} />}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen(MODAL_TYPES.DELETE_SERVER, { server })}
              className="text-rose-500 px-3 py-2 text-sm font-medium cursor-pointer hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white">
              Delete Server
              {/*<Trash className="h-4 w-4 ml-auto" />*/}
              <BsTrash2Fill className="h-[18px] w-[18px] ml-auto" />
            </DropdownMenuItem>
          )}

          {!isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen(MODAL_TYPES.LEAVE_SERVER, { server })}
              className="text-rose-500 px-3 py-2 text-sm font-medium cursor-pointer hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white">
              Leave Server
              <LogOut className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
