import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/admin'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};


// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// const isProtectedRoute = createRouteMatcher(["/admin"]);

// export default clerkMiddleware(async (auth, req) => {
//   const url = new URL(req.url);

//   // 🚫 Don’t enforce auth on sign-in/up pages
//   if (url.pathname.startsWith("/sign-in") || url.pathname.startsWith("/sign-up")) {
//     return NextResponse.next();
//   }

//   if (isProtectedRoute(req)) {
//     const { userId, sessionClaims } = await auth();

//     if (!userId) {
//       // 🚀 Redirect cleanly
//       return NextResponse.redirect(new URL("/sign-in", req.url));
//     }

//     const userEmail = sessionClaims?.email as string | undefined;
//     if (!userEmail) {
//       return NextResponse.redirect(new URL("/sign-in", req.url));
//     }

//     const dbUser = await prisma.user.findUnique({
//       where: { email: userEmail },
//     });

//     if (!dbUser) {
//       return NextResponse.redirect(new URL("/sign-in", req.url));
//     }
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     "/(api|trpc)(.*)",
//   ],
// };
