import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/vehicles/:path*",
    "/orders/:path*",
    "/sales/:path*",
    "/reports/:path*",
    "/quotations/:path*",
  ],
};
