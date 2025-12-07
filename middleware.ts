import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Check if the path starts with /admin but is not the login page
    const isAdminPath = path.startsWith('/admin');
    const isLoginPage = path === '/admin/login';

    // If trying to access admin area (but not login), check for auth
    if (isAdminPath && !isLoginPage) {
        // In a production app, you would verify the session token here
        // For now, we'll just check if there's a session cookie
        const hasSession = request.cookies.has('admin-session');

        if (!hasSession) {
            // Redirect to login if no session
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // If already logged in and trying to access login page, redirect to dashboard
    if (isLoginPage) {
        const hasSession = request.cookies.has('admin-session');
        if (hasSession) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
    matcher: '/admin/:path*',
};
