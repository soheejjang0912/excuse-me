import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all *approved* excuses
    const { data: excuses, error } = await supabase
      .from("excuses")
      .select("excuse_text")
      .eq("is_approved", true); // Only get approved excuses

    if (error) {
      console.error("Error fetching excuses:", error);
      return NextResponse.json(
        { error: "Failed to fetch excuses" },
        { status: 500 }
      );
    }

    if (!excuses || excuses.length === 0) {
      return NextResponse.json(
        { error: "No approved excuses found" },
        { status: 404 }
      );
    }

    // Pick a random excuse
    const randomIndex = Math.floor(Math.random() * excuses.length);
    const randomExcuse = excuses[randomIndex];

    return NextResponse.json(randomExcuse);
  } catch (e) {
    console.error("Unexpected error in generator:", e);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
