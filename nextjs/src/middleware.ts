import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes (require authentication)
const isProtectedRoute = createRouteMatcher([
    '/profile(.*)',
    '/admin(.*)',
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
    const { pathname, searchParams } = request.nextUrl;

    // Handle legacy URL redirects
    if (pathname === '/pages/conference-template.html' || pathname === '/pages/conference-template') {
        const id = searchParams.get('id');
        if (id) {
            return NextResponse.redirect(new URL(`/conference/${id}/`, request.url));
        }
    }

    if (pathname === '/' && searchParams.has('id')) {
        const id = searchParams.get('id');
        return NextResponse.redirect(new URL(`/conference/${id}/`, request.url));
    }

    // Protect routes that require authentication
    if (isProtectedRoute(request)) {
        await auth.protect();
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
