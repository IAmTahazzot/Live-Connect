import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

const InitialProfile = async () => {
  const user = await currentUser()

  if (!user) {
    return redirect('/sign-in')
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  })

  if (profile) {
    return profile
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName || user.emailAddresses[0].emailAddress.split('@')[0]} ${user.lastName || ''}`.trim(),
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      username: user.username,
    },
  })

  return newProfile
}

export default InitialProfile
