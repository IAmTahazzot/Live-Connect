'use client'

import { FinderDataType, FinderData } from '@/lib/types'
import { useGlobalData } from '@/hooks/use-global-data'
import { EmptyFinder } from '@/lib/doodles'
import { createRef, useEffect, useState } from 'react'
import Fuse from 'fuse.js'
import { FinderDataBlock } from './finder-data-block'
import { useFinder } from '@/hooks/use-finder'
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const Finder = () => {
  const { finderData, profile, syncFinderData } = useGlobalData()
  const { isOpen, close, open } = useFinder()
  const [mounted, setMounted] = useState(false)
  const [result, setResult] = useState<FinderData[]>([])
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [openingSelectedTypePage, setOpeningSelectedTypePage] = useState(false)
  const router = useRouter()

  const refs = result.map(() => createRef<HTMLDivElement>())

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        close()
      }
    })
  }, [close])

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      if (!isOpen && e.key === '/') {
        e.preventDefault()
        open()
      }
    }

    window.addEventListener('keydown', keydownHandler)

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', keydownHandler)
    }
  }, [isOpen])

  useEffect(() => {
    let q = query.trim() // query will be modified later
    if (!finderData) return

    // check if searching by any specific type
    // @ = username
    // * = server
    const type = query.at(0)
    const dataByTypes = []

    switch (type) {
      case '@':
        q = q.slice(1).trim()
        dataByTypes.push(...finderData.filter(value => value.type === 'friend'))
        break

      case '*':
        q = q.slice(1).trim()
        dataByTypes.push(...finderData.filter(value => value.type === 'server'))
        break

      default:
        dataByTypes.push(...finderData)
    }

    // use fuse to increase the accuracy of search
    const fuse = new Fuse(dataByTypes, {
      keys: ['server.name', 'channel.name', 'friend.username', 'friend.name'],
    })

    const filteredData = fuse.search(q)

    setResult(filteredData.map(({ item }) => item))
  }, [query, finderData])

  useEffect(() => {
    // reset selected index when result changes
    setActiveIndex(0)
  }, [result])

  if (!mounted || !isOpen || !profile) return null

  const openSelectedTypePage = async () => {
    const selectedData = result[activeIndex]

    if (!selectedData) return

    setOpeningSelectedTypePage(true)

    switch (selectedData.type) {
      case FinderDataType.SERVER:
        router.push(`/servers/${selectedData.server.id}`)
        close()
        break

      case FinderDataType.CHANNEL:
        router.push(`/servers/${selectedData.server.id}/channels/${selectedData.channel.id}`)
        close()
        break

      case FinderDataType.FRIEND:
        const res = await fetch('/api/conversation', {
          method: 'POST',
          body: JSON.stringify({
            conversationFrom: profile.id,
            conversationTo: selectedData.friend.id,
          }),
        })
        const { conversationId } = await res.json()
        router.push(`/me/${conversationId}`)
        close()
        break
    }

    setOpeningSelectedTypePage(false)
  }

  const handleArrowKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (openingSelectedTypePage) {
      e.preventDefault()
      return toast.info('Finder is busy, please wait a moment.')
    }

    const KEY = e.key

    if (['ArrowDown', 'ArrowUp', 'Enter'].includes(KEY)) {
      e.preventDefault()
    }

    if (KEY === 'ArrowDown') {
      if (result.length > 0) {
        setActiveIndex(prev => (prev + 1) % result.length)
        refs[(activeIndex + 1) % result.length].current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    } else if (KEY === 'ArrowUp') {
      if (result.length > 0) {
        setActiveIndex(prev => (prev - 1 + result.length) % result.length)
        refs[(activeIndex - 1 + result.length) % result.length].current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    } else if (KEY === 'Enter') {
      openSelectedTypePage()
    }
  }

  return (
    <div className="pt-32 fixed top-0 left-0 w-full h-full overflow-y-auto bg-black/75 z-[99]" onClick={close}>
      <div
        className="w-11/12 sm:w-9/12 max-w-[550px] mx-auto rounded-lg bounce-up bg-[#2b2d31] overflow-hidden px-5"
        id="finder"
        onClick={e => {
          e.stopPropagation()
        }}>
        <main>
          <input
            className="bg-[#111214c2] h-[46px] md:h-[70px] px-3 rounded-sm my-5 w-full text-xl text-gray-200 placeholder:text-zinc-400/60"
            placeholder="Where would you like to go?"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            onKeyDown={handleArrowKey}
            autoFocus
          />

          {result.length > 0 && (
            <div>
              <div className="space-y-1 max-h-[240px] overflow-y-auto" id="finderBlocks">
                {result.map((data, index) => (
                  <FinderDataBlock
                    ref={refs[index]}
                    data={data}
                    key={index}
                    selected={activeIndex === index}
                    onHover={() => {
                      activeIndex !== index && setActiveIndex(index)
                    }}
                    onClick={openSelectedTypePage}
                    openingSelectedTypePage={activeIndex === index && openingSelectedTypePage}
                  />
                ))}
              </div>
              <div className="h-[1px] bg-zinc-700 my-2"></div>
            </div>
          )}

          {result.length === 0 && query && (
            <div className="my-2 text-center">
              <EmptyFinder className="mx-auto" />
              <p className="mt-3 mb-6 text-gray-400 font-medium">Sorry mate, no results found.</p>
              <div className="h-[1px] bg-zinc-700 my-2"></div>
            </div>
          )}
        </main>

        <footer className="mb-4 mt-2">
          <div className="text-xs text-[oklab(0.786807_-0.0025776_-0.0110238)] font-medium">
            <strong className="text-emerald-400 font-bold uppercase">Proptip: </strong>
            <span>Start searches with</span>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger>
                  <span className="inline-flex items-center bg-[#232427] rounded-sm ml-[2px] px-1 py-[2px]">@</span>
                </TooltipTrigger>
                <TooltipContent>Usernames</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <span className="inline-flex items-center bg-[#232427] rounded-sm ml-[2px] px-1 py-[2px]">*</span>
                </TooltipTrigger>
                <TooltipContent>Servers</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span> </span>
            <span>to narrow results.</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
