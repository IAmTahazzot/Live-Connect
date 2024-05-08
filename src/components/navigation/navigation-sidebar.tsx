import { currentProfile } from '@/lib/current-profile'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import NavigationAction from '@/components/navigation/navigation-action'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { NavigationItem } from '@/components/navigation/navigation-item'
import { ModeToggle } from '@/components/mode-toggle'
import ClerkUserButton from '@/components/user-button'

export const NavigationSidebar = async () => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('/')
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  } as any)

  if (!servers) {
    return redirect('/')
  }

  return (
    <div
      className={'space-y-2 flex flex-col items-center h-full text-primary w-full bg-[#e3e5e8] dark:bg-[#1E1F22] py-3'}>
      <NavigationAction />
      <Separator className={'h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-8 mx-auto'} />

      <ScrollArea className={'flex-1 w-full'}>
        {servers.map(server => (
          <div key={server.id} className={'mb-2'}>
            <NavigationItem id={server.id} imageUrl={server.imageUrl} name={server.name} />
          </div>
        ))}
      </ScrollArea>

      {/* <div className={'pb-3 mt-auto flex items-center flex-col gap-y-4'}>
        <ModeToggle />
        <ClerkUserButton />
      </div> */}
    </div>
  )
}
