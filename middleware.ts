import { NextRequest, NextResponse } from 'next/server';

// List of protected routes accessible only with authToken
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/setupMeeting']; // you can add more here

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const otpToken = req.cookies.get('otpToken');
  const authToken = req.cookies.get('authToken');
  const meetingToken = req.cookies.get('meetingToken')
  // Case 1: No cookies
  if (!otpToken && !authToken) {
    if (pathname === '/' || pathname === '/auth') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Case 2: Only otpToken is present
  if (otpToken && !authToken) {
    if (pathname === '/verify') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/verify', req.url));
  }

  // Case 3: authToken is present
  if (authToken) {
    if (pathname === '/auth' || pathname === '/verify' || pathname==='/') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if ( protectedRoutes.includes(pathname) && pathname !== '/setupMeeting') {
      return NextResponse.next();
    }

    // Optional: redirect all unknown routes to /dashboard
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/', '/auth', '/verify', '/dashboard', '/profile', '/settings'], // Add your protected/public routes
};
