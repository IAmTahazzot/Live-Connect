import initialProfile from '@/lib/initial-profile'
import { redirect } from 'next/navigation'

const Home = async () => {
  await initialProfile()

  return redirect(`/me`)
}

export default Home
