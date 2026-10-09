import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const blogUrl =
    process.env.BLOG_URL || "https://with-zones-blog-mu.vercel.app";

  if (pathname.startsWith("/blog") || pathname.startsWith("/blog-static")) {
    const destinationUrl = new URL(`${pathname}${search}`, blogUrl);

    return NextResponse.rewrite(destinationUrl, {
      request: {
        headers: new Headers({
          ...Object.fromEntries(request.headers),
          host: new URL(blogUrl).host,
          "x-forwarded-host": request.headers.get("host") || "",
        }),
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/blog/:path*", "/blog", "/blog-static/:path*"],
};
