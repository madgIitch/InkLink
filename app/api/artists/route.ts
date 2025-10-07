import { NextResponse } from "next/server";

const DB = [
  { id: "a1", name: "Lina K.", city: "Berlin", styles: ["fineline", "minimal"], rating: 4.6 },
  { id: "a2", name: "Marco T.", city: "Hamburg", styles: ["traditional", "japanese"], rating: 4.9 },
  { id: "a3", name: "Aiko S.", city: "Berlin", styles: ["blackwork", "geometric"], rating: 4.4 },
  { id: "a4", name: "Nora V.", city: "Leipzig", styles: ["dotwork", "fineline"], rating: 4.2 },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = (searchParams.get("city") ?? "").trim().toLowerCase();
  const style = (searchParams.get("style") ?? "").trim().toLowerCase();

  const artists = DB.filter((a) => {
    const byCity = city ? a.city.toLowerCase().includes(city) : true;
    const byStyle = style ? a.styles.some((s) => s.toLowerCase().includes(style)) : true;
    return byCity && byStyle;
  });

  return NextResponse.json({ artists });
}
