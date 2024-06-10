import { FinderData, FinderDataType } from '@/app/api/finder-data/route'
import Image from 'next/image'
import { GoHash } from 'react-icons/go'
import { FaVideo } from 'react-icons/fa'
import { Audio, Discord } from '../icons'
import { cn } from '@/lib/utils'

type FinderDataBlockProps = {
  data: FinderData
  selected?: boolean
  onHover?: () => void
  onClick?: () => void
  openingSelectedTypePage?: boolean
}

export const FinderDataBlock = ({
  data,
  selected,
  onHover,
  onClick,
  openingSelectedTypePage,
}: FinderDataBlockProps) => {
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
          <div className='flex justify-between items-center'>
            <span>{data.channel.name}</span>
            <span className='text-sm opacity-70'>{data.server.name}</span>
          </div>
        </>
      )
      break
  }

  return (
    <div
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

const OpeningLoader = () => {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="inline w-4 h-4 text-zinc-600 animate-spin fill-zinc-200"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  )
}
