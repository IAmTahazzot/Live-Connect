'use client'

import '@livekit/components-styles'
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
} from '@livekit/components-react'
import { Track } from 'livekit-client'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Logger } from './logger'
import { LuTimerOff } from 'react-icons/lu'

type ChannelRoomProps = {
  channelId: string
  video: boolean
  audio: boolean
}

export const ChannelRoom = ({ channelId, video, audio }: ChannelRoomProps) => {
  const { user, isLoaded } = useUser()
  const [token, setToken] = useState('')
  const [isTimeout, setIsTimeout] = useState(false)

  const room = channelId

  useEffect(() => {
    ;(async () => {
      if (!user) {
        return console.log('no username sorry')
      }

      try {
        const resp = await fetch(
          `/api/get-participant-token?room=${room}&username=${user.username + ' ' + user.id}&name=${user.username}`
        )
        const data = await resp.json()
        setToken(data.token)
      } catch (e) {
        console.error(e)
      }
    })()

    // disconnect from the room when the component unmounts and after 20 seconds
    return () => {
      const TIMEOUT = 1000 * 60 * 5 // 5 minutes

      setTimeout(() => {
        setToken('')
        setIsTimeout(true)
      }, TIMEOUT)
    }
  }, [user])

  if (!isLoaded) {
    return <div className="grid place-items-center p-2">Getting user data...</div>
  }

  if (isTimeout) {
    return (
      <div className="grid place-items-center p-2">
        <div className="space-y-4 w-[90%] sm:max-w-[600px]">
          <LuTimerOff className="text-gray-500 mx-auto" size={72} />
          <div className="text-gray-400 text-sm text-center">
            This prototype is designed to offer a maximum session duration of 5 minutes due to the high operational
            costs involved. This duration is deemed sufficient for users to familiarize themselves with the
            feature&apos;s functionality. For deployment in a production environment, the session duration can be
            adjusted according to requirements. You may explore other features of the app or refresh the page to start a
            new session.
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <div className="grid place-items-center p-2">Unexpected s**t happened, try to refresh to login again.</div>
  }

  if (token === '') {
    return <div className="grid place-items-center p-2">Getting token...</div>
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: '100dvh' }}>
      {/* Your custom component with basic video conferencing functionality. */}
      <MyVideoConference />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
      <ControlBar />
    </LiveKitRoom>
  )
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  )
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  )
}
