import { createServerClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { excuseId } = await request.json();

    if (!excuseId) {
      return NextResponse.json(
        { error: "Excuse ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    const { error } = await supabase.rpc('increment_usage', {
      excuse_id_param: excuseId
    });

    if (error) {
      console.error("Error incrementing usage count:", error);
      // Temporarily return the detailed error for debugging
      return NextResponse.json({ error: "Failed to update count", db_error: error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking excuse:", error);
    return NextResponse.json(
      { error: "Failed to track excuse" },
      { status: 500 }
    );
  }
}
