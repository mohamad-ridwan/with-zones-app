export async function proxy(request) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/your-path" && myFeatureFlag.isEnabled()) {
    return NextResponse.rewrite(`${rewriteDomain}${pathname}${search}`);
  }
}
