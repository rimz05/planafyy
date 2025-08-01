import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
  const { userId, orgId } = await auth();

  if (userId && isPublicRoute(req)) {
    const path = orgId ? `/organization/${orgId}` : '/select-org';
    return NextResponse.redirect(new URL(path, req.url));
  }

  if(!userId && !isPublicRoute(req)){
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }

  if(userId && !orgId && req.nextUrl.pathname !== "/select-org"){
    const orgselection = new URL("/select-org", req.url)
    return NextResponse.redirect(orgselection)
  }

})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}