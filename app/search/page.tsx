// app/search/page.tsx
import type { Metadata } from "next";
import SearchResults from "@/app/search/SearchResults";

export const metadata: Metadata = {
  title: "Buscar tatuadores — InkLink",
};

export const dynamic = "force-dynamic";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { city?: string; style?: string };
}) {
  const city = typeof searchParams.city === "string" ? searchParams.city : "";
  const style = typeof searchParams.style === "string" ? searchParams.style : "";
  return <SearchResults initialCity={city} initialStyle={style} />;
}
