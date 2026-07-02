import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  switch (locale) {
    case "en":
      return {
        locale,
        messages: (await import("../../messages/en.json")).default,
      };

    case "uk":
    default:
      return {
        locale: "uk",
        messages: (await import("../../messages/uk.json")).default,
      };
  }
});