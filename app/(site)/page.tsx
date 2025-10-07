// app/(site)/page.tsx (ejemplo)
import SearchBar from "@/components/SearchBar";

const STYLES = [
  "blackwork",
  "fineline",
  "realism",
  "traditional",
  "neo-trad",
  "japanese",
  "dotwork",
  "watercolor",
  "lettering",
  "geometric",
  "minimal",
];

export default function Home() {
  async function handleSearch({ city, style }: { city: string; style: string }) {
    // Llama a tu router/acción/server function
    console.log("Buscar:", city, style);
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <SearchBar onSearch={handleSearch} stylesList={STYLES} />
    </main>
  );
}
