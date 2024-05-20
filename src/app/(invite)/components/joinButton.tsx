'use client'

import React, { useState } from 'react'
import axios from 'axios'

interface InviteButtonProps {
  inviteCode: string
}

export default function JoinButton({ inviteCode }: InviteButtonProps) {
  const [joinState, setJoinState] = useState('Join')

  const joinServer = async () => {
    try {
      setJoinState('Joining...')

      const joinRequest = await axios.patch(`/api/join-server/${inviteCode}/join`)

      let seconds = 5

      const tempInterval = setInterval(() => {
        seconds--
        setJoinState(`Redirecting in ${seconds}s`)

        if (seconds === 0) {
          clearInterval(tempInterval)
          window.location.href = `/servers/${joinRequest.data.id}`
        }
      }, 1000)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <button
      disabled={joinState !== 'Join'}
      onClick={joinServer}
      className={
        'bg-[--color-primary] hover:bg-[--color-primary-hover] transition-colors font-medium  rounded-[4px] text-white h-[44px] w-full'
      }>
      {joinState}
    </button>
  )
}
