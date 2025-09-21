import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const logs: string[] = [];
  logs.push("--- /api/rankings endpoint hit ---");
  try {
    logs.push("Attempting to create Supabase client...");
    const supabase = await createClient();
    logs.push("Supabase client created successfully.");

    logs.push("Fetching rankings from 'excuses' table...");
    const { data: rankings, error } = await supabase
      .from("excuses")
      .select("*")
      .eq("is_approved", true)
      .order("usage_count", { ascending: false })
      .order("created_at", { ascending: false });
    logs.push("Supabase query completed.");

    if (error) {
      logs.push(`DATABASE ERROR: ${JSON.stringify(error)}`);
      throw new Error("Database query failed.");
    }

    logs.push(`Successfully fetched ${rankings?.length || 0} ranking entries.`);
    // Calculate total usage
    const totalUsage =
      rankings?.reduce((sum, excuse) => sum + excuse.usage_count, 0) || 0;
    logs.push(`Calculated total usage: ${totalUsage}`);

    return NextResponse.json({
      rankings: rankings || [],
      totalUsage,
      success: true,
      server_logs: logs // Include logs in success response too, for full context
    });
  } catch (e) {
    logs.push(`UNCAUGHT ERROR: ${e.message}`);
    console.error("Error in /api/rankings:", { logs, error: e });
    return NextResponse.json(
      {
        error: "Internal server error",
        details: e.message,
        rankings: [],
        totalUsage: 0,
        server_logs: logs // Send all accumulated logs to the client
      },
      { status: 500 }
    );
  }
}
