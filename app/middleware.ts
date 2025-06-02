import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuth = request.cookies.get('auth-token')?.value;
  const protectedPaths = ['/dashboard'];
  console.log(protectedPaths,'protectedPathsprotectedPaths');
  
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // For debugging: Add header showing if protected and auth status
  const response = NextResponse.next();
  response.headers.set('x-debug-isProtected', String(isProtected));
  response.headers.set('x-debug-isAuth', String(!!isAuth));

  if (isProtected && !isAuth) {
    return NextResponse.redirect(new URL('/register', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/dashboard'],
};
