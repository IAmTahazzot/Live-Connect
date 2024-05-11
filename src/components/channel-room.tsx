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

type ChannelRoomProps = {
  channelId: string
  video: boolean
  audio: boolean
}

export const ChannelRoom = ({ channelId, video, audio }: ChannelRoomProps) => {
  const { user, isLoaded } = useUser()
  const [token, setToken] = useState('')
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
  }, [user])

  if (!isLoaded) {
    return <div>Getting user data</div>
  }

  if (!user) {
    return <div>Not logged in</div>
  }

  if (token === '') {
    return <div>Getting token...</div>
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
