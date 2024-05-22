import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/', '/icon', '/api/uploadthing', '/invite/(.*)', '/api/servers'],
  ignoredRoutes: ['/((?!api|trpc))(_next.*|.+.[w]+$)'],
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
