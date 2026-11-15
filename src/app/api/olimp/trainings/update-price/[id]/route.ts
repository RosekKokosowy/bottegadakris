import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/authentication.inc";
import { updateWorkshopPrice } from "@/lib/workshop.inc";

export const PUT = withAdmin("PUT /api/olimp/trainings/update-price/[id]", async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const id = Number((await params).id);
    const cena = parseFloat((await req.json()).cena);
    if (!id) return NextResponse.json({ error: "ID warsztatu jest wymagane" }, { status: 400 });
    if (isNaN(cena) || cena < 0) return NextResponse.json({ error: "Nieprawidłowa cena warsztatu" }, { status: 400 });

    const data = await updateWorkshopPrice(id, cena);
    if (!data) return NextResponse.json({ error: "Warsztat nie został znaleziony lub jest nieaktywny" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Cena warsztatu została zaktualizowana", data });
});
