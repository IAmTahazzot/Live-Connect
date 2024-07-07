'use client'

import React, { useEffect, useState } from 'react'
import CreateServerModal from '@/components/modals/create-server-modal'
import InviteModal from '@/components/modals/invite-modal'
import EditServerModal from '@/components/modals/edit-server-modal'
import MembersModal from '@/components/modals/members-modal'
import CreateChannelModal from '@/components/modals/create-channel-modal'
import LeaveServer from '@/components/modals/leave-server-modal'
import DeleteServer from '@/components/modals/delete-server-modal'
import DeleteChannel from '@/components/modals/delete-channel-modal'
import EditChannelModal from '@/components/modals/edit-channel-modal'
import MessageFileModal from '@/components/modals/message-file-modal'
import { DeleteMessageModal } from '@/components/modals/message-delete-modal'
import { ProfileModal } from '../modals/profile-modal'

const ModalProvider = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null

  return (
    <div>
      <CreateServerModal />
      <EditServerModal />
      <MembersModal />
      <InviteModal />
      <CreateChannelModal />
      <LeaveServer />
      <DeleteServer />
      <DeleteChannel />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
      <ProfileModal />
    </div>
  )
}

export default ModalProvider
