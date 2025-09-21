import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  console.log("--- /api/approved-excuses endpoint hit ---");
  try {
    console.log("Attempting to create Supabase client...");
    const supabase = await createServerClient();
    console.log("Supabase client created successfully.");

    console.log("Fetching approved excuses from 'excuses' table...");
    const { data, error } = await supabase
      .from("excuses")
      .select("excuse_text, id")
      .eq("is_approved", true)
      .order("approved_at", { ascending: false });
    console.log("Supabase query completed.");

    if (error) {
      console.error("DATABASE ERROR while fetching approved excuses:", error);
      return NextResponse.json({ error: "Failed to fetch approved excuses", db_error: error }, { status: 500 });
    }

    console.log(`Successfully fetched ${data?.length || 0} excuses.`);
    return NextResponse.json(data || []);
  } catch (e) {
    console.error("UNCAUGHT ERROR in /api/approved-excuses:", e);
    return NextResponse.json(
      { error: "Internal server error", details: e.message },
      { status: 500 }
    );
  }
}
