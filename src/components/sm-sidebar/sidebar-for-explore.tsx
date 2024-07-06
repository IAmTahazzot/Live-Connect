'use client'

import NavigationAction from '@/components/navigation/navigation-action'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { NavigationItem } from '@/components/navigation/navigation-item'
import { useGlobalData } from '@/hooks/use-global-data'

export const SmNavigationSidebar = () => {
  const { profile, servers } = useGlobalData()

  if (!profile) {
    return null
  }

  return (
    <div
      className={'space-y-2 flex flex-col items-center h-full text-primary w-full bg-[#e3e5e8] dark:bg-[#1E1F22] py-3'}>
      <NavigationAction />

      {servers && servers.length > 0 && (
        <>
          <Separator className={'h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-8 mx-auto'} />

          <ScrollArea className={'flex-1 w-full'}>
            {servers.map(server => (
              <div key={server.id} className={'mb-2'}>
                <NavigationItem id={server.id} imageUrl={server.imageUrl} name={server.name} />
              </div>
            ))}
          </ScrollArea>
        </>
      )}
    </div>
  )
}
