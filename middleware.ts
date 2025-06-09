import { NextResponse } from "next/server";
import { NextRequest } from "next/server"; // Import the correct type for the request

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define the public routes that should remain unprotected
  const isPublicPath: string[] = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
    "/change-password",
   ];
 
  // Allow requests to static files and assets
  if (
    path.startsWith("/_next") ||
    path.startsWith("/images") ||
    path.includes(".") ||
    path === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Retrieve the authentication token from cookies
  const token = request.cookies.get("collintoken")?.value; // Extract the token from the "malloryToken" cookie

  // If the user is not authenticated and the route is not public, redirect to /login
  if (!isPublicPath.includes(path) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
 
  // If the user is authenticated and trying to access a public route, redirect to /home
  if (isPublicPath.includes(path) && token) {
     
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

//   return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect all routes except API routes, static files, and images
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
