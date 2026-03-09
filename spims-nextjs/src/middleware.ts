import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect old auth paths to new users-dashboard paths
  if (pathname.startsWith('/auth/')) {
    const newPath = pathname.replace('/auth/', '/users-dashboard/auth/');
    console.log(`Redirecting ${pathname} to ${newPath}`);
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Redirect old complaint paths to new users-dashboard paths
  if (pathname.startsWith('/complaints/')) {
    const newPath = pathname.replace('/complaints/', '/users-dashboard/complaints/');
    console.log(`Redirecting ${pathname} to ${newPath}`);
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Redirect old dashboard path to new users-dashboard path
  if (pathname === '/dashboard') {
    console.log(`Redirecting ${pathname} to /users-dashboard`);
    return NextResponse.redirect(new URL('/users-dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/complaints/:path*',
    '/dashboard'
  ]
};