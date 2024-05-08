import { currentProfile } from '@/lib/current-profile'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { $Enums } from '.prisma/client'
import ChannelType = $Enums.ChannelType
import { ServerHeader } from '@/components/server/server-header'
import { ScrollArea } from '@/components/ui/scroll-area'
import ServerSection from '@/components/server/server-section'
import { ServerChannel } from '@/components/server/server-channel'
import { ServerMember } from '@/components/server/server-member'
import Image from 'next/image'
import { Cog } from 'lucide-react'

interface ServerSidebarProps {
  serverId: string
}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('/')
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  })

  if (!server) {
    return redirect('/')
  }

  const textChannels = server.channels.filter(channel => channel.type === ChannelType.TEXT)
  const audioChannels = server.channels.filter(channel => channel.type === ChannelType.AUDIO)
  const videoChannels = server.channels.filter(channel => channel.type === ChannelType.VIDEO)
  const members = server.members.filter(member => member.profileId !== profile.id)

  const role = server.members.find(member => member.profileId === profile.id)?.role

  return (
    <div className={'flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'}>
      <ServerHeader server={server} role={role} />

      <ScrollArea className={'p-2'}>
        {!!textChannels.length && (
          <div className={'mb-2'}>
            <ServerSection
              channelType={ChannelType.TEXT}
              sectionType={'channels'}
              label={'Text channels'}
              role={role}
            />

            <div className="space-y-[2px]">
              {textChannels.map(channel => (
                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
              ))}
            </div>
          </div>
        )}

        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection sectionType="channels" channelType={ChannelType.AUDIO} role={role} label="Voice Channels" />
            <div className="space-y-[2px]">
              {audioChannels.map(channel => (
                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
              ))}
            </div>
          </div>
        )}

        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection sectionType="channels" channelType={ChannelType.VIDEO} role={role} label="Video Channels" />
            <div className="space-y-[2px]">
              {videoChannels.map(channel => (
                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
              ))}
            </div>
          </div>
        )}

        {!!members?.length && (
          <div className="mb-2">
            <ServerSection sectionType="members" role={role} label="Members" server={server} />
            <div className="space-y-[2px]">
              {members.map(member => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>

      <div className="grid grid-cols-2 items-center dark:bg-[hsla(var(--background-deep-dark),.8)] px-2 py-[6px]">
        <div className="flex items-center gap-2 dark:hover:bg-[hsla(var(--background-modifier-selected)/.3)] rounded-sm p-[2px] select-none cursor-pointer">
          <div className="w-8 h-8 relative rounded-full">
            <Image src={profile.imageUrl} fill alt="user profile picture" priority={true} />
            <div className=" box-content absolute h-[10px] w-[10px] rounded-full bg-emerald-500 -bottom-[2px] -right-1 z-10 border-solid border-[4px] dark:border-[#212226]"></div>
          </div>
          <div className="flex flex-col gap-0">
            <h4 className="text-sm mb-0">{profile.name}</h4>
            <p className="text-[12px] text-gray-400 m-0">Online</p>
          </div>
        </div>
        <div className="grid content-center justify-items-end pr-2">
          <div className="rounded-sm dark:hover:bg-[hsla(var(--background-modifier-selected)/.3)] p-[2px] h-8 w-8 flex items-center justify-center">
            <button className="hover:rotate-180 duration-1000 delay-300">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                style={{
                  width: '100%',
                  height: '100%',
                  transform: 'translate3d(0px, 0px, 0px)',
                  contentVisibility: 'visible',
                }}>
                <defs>
                  <clipPath id="__lottie_element_100">
                    <rect width="24" height="24" x="0" y="0"></rect>
                  </clipPath>
                  <clipPath id="__lottie_element_102">
                    <path d="M0,0 L600,0 L600,600 L0,600z"></path>
                  </clipPath>
                </defs>
                <g clipPath="url(#__lottie_element_100)">
                  <g
                    clipPath="url(#__lottie_element_102)"
                    transform="matrix(0.03999999910593033,0,0,0.03999999910593033,0,0)"
                    opacity="1"
                    style={{
                      display: 'block',
                    }}>
                    <g
                      transform="matrix(25,0,0,25,300,300)"
                      opacity="1"
                      style={{
                        display: 'block',
                      }}>
                      <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                        <path
                          className="dark:fill-gray-400"
                          fillOpacity="1"
                          d=" M-1.4420000314712524,-10.906000137329102 C-1.8949999809265137,-10.847000122070312 -2.1470000743865967,-10.375 -2.078000068664551,-9.92300033569336 C-1.899999976158142,-8.756999969482422 -2.265000104904175,-7.7210001945495605 -3.061000108718872,-7.390999794006348 C-3.8570001125335693,-7.060999870300293 -4.8480000495910645,-7.534999847412109 -5.546000003814697,-8.484999656677246 C-5.816999912261963,-8.852999687194824 -6.329999923706055,-9.008999824523926 -6.691999912261963,-8.730999946594238 C-7.458000183105469,-8.142999649047852 -8.142999649047852,-7.458000183105469 -8.730999946594238,-6.691999912261963 C-9.008999824523926,-6.329999923706055 -8.852999687194824,-5.816999912261963 -8.484999656677246,-5.546000003814697 C-7.534999847412109,-4.8480000495910645 -7.060999870300293,-3.8570001125335693 -7.390999794006348,-3.061000108718872 C-7.7210001945495605,-2.265000104904175 -8.756999969482422,-1.899999976158142 -9.92300033569336,-2.078000068664551 C-10.375,-2.1470000743865967 -10.847000122070312,-1.8949999809265137 -10.906000137329102,-1.4420000314712524 C-10.968000411987305,-0.9700000286102295 -11,-0.48899999260902405 -11,0 C-11,0.48899999260902405 -10.968000411987305,0.9700000286102295 -10.906000137329102,1.4420000314712524 C-10.847000122070312,1.8949999809265137 -10.375,2.1470000743865967 -9.92300033569336,2.078000068664551 C-8.756999969482422,1.899999976158142 -7.7210001945495605,2.265000104904175 -7.390999794006348,3.061000108718872 C-7.060999870300293,3.8570001125335693 -7.534999847412109,4.8470001220703125 -8.484999656677246,5.546000003814697 C-8.852999687194824,5.816999912261963 -9.008999824523926,6.328999996185303 -8.730999946594238,6.691999912261963 C-8.142999649047852,7.458000183105469 -7.458000183105469,8.142999649047852 -6.691999912261963,8.730999946594238 C-6.329999923706055,9.008999824523926 -5.816999912261963,8.852999687194824 -5.546000003814697,8.484999656677246 C-4.8480000495910645,7.534999847412109 -3.8570001125335693,7.060999870300293 -3.061000108718872,7.390999794006348 C-2.265000104904175,7.7210001945495605 -1.899999976158142,8.756999969482422 -2.078000068664551,9.92300033569336 C-2.1470000743865967,10.375 -1.8949999809265137,10.847000122070312 -1.4420000314712524,10.906000137329102 C-0.9700000286102295,10.968000411987305 -0.48899999260902405,11 0,11 C0.48899999260902405,11 0.9700000286102295,10.968000411987305 1.4420000314712524,10.906000137329102 C1.8949999809265137,10.847000122070312 2.1470000743865967,10.375 2.078000068664551,9.92300033569336 C1.899999976158142,8.756999969482422 2.2660000324249268,7.7210001945495605 3.062000036239624,7.390999794006348 C3.8580000400543213,7.060999870300293 4.8480000495910645,7.534999847412109 5.546000003814697,8.484999656677246 C5.816999912261963,8.852999687194824 6.328999996185303,9.008999824523926 6.691999912261963,8.730999946594238 C7.458000183105469,8.142999649047852 8.142999649047852,7.458000183105469 8.730999946594238,6.691999912261963 C9.008999824523926,6.328999996185303 8.852999687194824,5.816999912261963 8.484999656677246,5.546000003814697 C7.534999847412109,4.8480000495910645 7.060999870300293,3.8570001125335693 7.390999794006348,3.061000108718872 C7.7210001945495605,2.265000104904175 8.756999969482422,1.899999976158142 9.92300033569336,2.078000068664551 C10.375,2.1470000743865967 10.847000122070312,1.8949999809265137 10.906000137329102,1.4420000314712524 C10.968000411987305,0.9700000286102295 11,0.48899999260902405 11,0 C11,-0.48899999260902405 10.968000411987305,-0.9700000286102295 10.906000137329102,-1.4420000314712524 C10.847000122070312,-1.8949999809265137 10.375,-2.1470000743865967 9.92300033569336,-2.078000068664551 C8.756999969482422,-1.899999976158142 7.7210001945495605,-2.265000104904175 7.390999794006348,-3.061000108718872 C7.060999870300293,-3.8570001125335693 7.534999847412109,-4.8480000495910645 8.484999656677246,-5.546000003814697 C8.852999687194824,-5.816999912261963 9.008999824523926,-6.329999923706055 8.730999946594238,-6.691999912261963 C8.142999649047852,-7.458000183105469 7.458000183105469,-8.142999649047852 6.691999912261963,-8.730999946594238 C6.328999996185303,-9.008999824523926 5.817999839782715,-8.852999687194824 5.546999931335449,-8.484999656677246 C4.848999977111816,-7.534999847412109 3.8580000400543213,-7.060999870300293 3.062000036239624,-7.390999794006348 C2.2660000324249268,-7.7210001945495605 1.9010000228881836,-8.756999969482422 2.0789999961853027,-9.92300033569336 C2.1480000019073486,-10.375 1.8949999809265137,-10.847000122070312 1.4420000314712524,-10.906000137329102 C0.9700000286102295,-10.968000411987305 0.48899999260902405,-11 0,-11 C-0.48899999260902405,-11 -0.9700000286102295,-10.968000411987305 -1.4420000314712524,-10.906000137329102z M4,0 C4,2.2090001106262207 2.2090001106262207,4 0,4 C-2.2090001106262207,4 -4,2.2090001106262207 -4,0 C-4,-2.2090001106262207 -2.2090001106262207,-4 0,-4 C2.2090001106262207,-4 4,-2.2090001106262207 4,0z"></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
