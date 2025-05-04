import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebase';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
  
  // If trying to access admin page without session
  if (isAdminPage && !session) {
    // Allow access to admin page - the client-side auth will handle the login UI
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
}; 