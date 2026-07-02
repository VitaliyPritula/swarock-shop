import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "uk"],
  defaultLocale: "uk",
});

export const config = {
  matcher: ["/", "/(ua|en)/:path*"],
};