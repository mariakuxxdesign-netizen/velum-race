import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;

  if (!password || !request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const header = request.headers.get("authorization");

  if (header) {
    try {
      const [scheme, encoded] = header.split(" ");
      const [, providedPassword] = atob(encoded || "").split(":");

      if (scheme === "Basic" && providedPassword === password) {
        return NextResponse.next();
      }
    } catch {
      return unauthorized();
    }
  }

  return unauthorized();
}

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Velum Race admin"'
    }
  });
}

export const config = {
  matcher: "/admin/:path*"
};
