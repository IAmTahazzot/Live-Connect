import { FinderDataType, FinderData } from '@/lib/types'
import Image from 'next/image'
import { GoHash } from 'react-icons/go'
import { FaVideo } from 'react-icons/fa'
import { Audio, Discord } from '../icons'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import { OpeningLoader } from '../loader/finder-opening-loader'

type FinderDataBlockProps = {
  data: FinderData
  selected?: boolean
  onHover?: () => void
  onClick?: () => void
  openingSelectedTypePage?: boolean
}

const DataBlock = (
  { data, selected, onHover, onClick, openingSelectedTypePage }: FinderDataBlockProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  let dom: React.ReactNode

  switch (data.type) {
    case FinderDataType.FRIEND:
      dom = (
        <>
          {openingSelectedTypePage ? (
            <OpeningLoader />
          ) : (
            <Image src={data.friend.imageUrl} width={20} height={20} alt="friend" className="rounded-full" />
          )}
          <span>{data.friend.name}</span>
        </>
      )
      break

    case FinderDataType.SERVER:
      const ServerImage = openingSelectedTypePage ? (
        <OpeningLoader />
      ) : data.server.imageUrl ? (
        <Image src={data.server.imageUrl} width={20} height={20} alt="server" className="rounded-full" />
      ) : (
        <div className="h-5 w-5 rounded-full bg-[#5865f2] grid place-items-center text-[11px] text-white font-sans">
          <Discord size={14} />
        </div>
      )

      dom = (
        <>
          {ServerImage}
          <span>{data.server.name}</span>
        </>
      )
      break

    case FinderDataType.CHANNEL:
      const ChannelTypeIcons = {
        AUDIO: <Audio size={18} />,
        TEXT: <GoHash size={18} />,
        VIDEO: <FaVideo size={15} />,
      }

      dom = (
        <>
          {openingSelectedTypePage ? <OpeningLoader /> : ChannelTypeIcons[data.channel.type]}
          <div className="flex justify-between items-center">
            <span>{data.channel.name}</span>
            <span className="text-sm opacity-70">{data.server.name}</span>
          </div>
        </>
      )
      break
  }

  return (
    <div
      ref={ref}
      className={cn(
        'grid grid-cols-[26px_1fr] items-center h-8 rounded-sm px-2 cursor-pointer text-[oklab(0.786807_-0.0025776_-0.0110238)] font-medium',
        selected && 'bg-[hsl(var(--background-modifier-selected)/.6)]'
      )}
      onMouseOver={onHover}
      onClick={onClick}>
      {dom}
    </div>
  )
}

export const FinderDataBlock = forwardRef(DataBlock)
