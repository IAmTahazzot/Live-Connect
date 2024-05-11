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
      name: `${user.firstName || 'user-' + user.id} ${user.lastName || ''}`.trim(),
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  })

  return newProfile
}

export default InitialProfile
