import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isSupportedLocale } from "@/config/i18n";

export default async function RootCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cookieStore = await cookies();
  const headersList = await headers();
  const rawLocale =
    headersList.get("x-locale") ||
    cookieStore.get(LOCALE_COOKIE)?.value ||
    DEFAULT_LOCALE;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  redirect(`/${locale}/blog/category/${category}`);
}
