import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const logs: string[] = [];
  logs.push("--- /api/database-stats endpoint hit ---");
  try {
    logs.push("Attempting to create Supabase client...");
    const supabase = await createClient();
    logs.push("Supabase client created successfully.");

    // Get total count of APPROVED excuses
    logs.push("Fetching total count of APPROVED excuses...");
    const { count: totalExcuses, error: countError } = await supabase
        .from("excuses")
        .select("*", { count: "exact", head: true })
        .eq("is_approved", true); // Filter by approved

    if (countError) {
      logs.push(`DATABASE ERROR (count): ${JSON.stringify(countError)}`);
      throw new Error("Failed to fetch total excuses count.");
    }
    logs.push(`Total APPROVED excuses fetched: ${totalExcuses}`);

    // Get total usage count (sum of all usage_count for APPROVED excuses)
    logs.push("Fetching usage data for APPROVED excuses...");
    const { data: usageData, error: usageError } = await supabase
        .from("excuses")
        .select("usage_count")
        .eq("is_approved", true); // Filter by approved

    if (usageError) {
      logs.push(`DATABASE ERROR (usage): ${JSON.stringify(usageError)}`);
      throw new Error("Failed to fetch total usage count.");
    }

    const totalUsage =
        usageData?.reduce((sum, item) => sum + (item.usage_count || 0), 0) || 0;
    logs.push(`Total APPROVED usage calculated: ${totalUsage}`);

    return NextResponse.json({
      totalExcuses: totalExcuses || 0,
      totalUsage: totalUsage,
      server_logs: logs, // Include logs in success response
    });
  } catch (e) {
    logs.push(`UNCAUGHT ERROR in /api/database-stats: ${e.message}`);
    console.error("Error fetching database stats:", { logs, error: e });
    return NextResponse.json(
        {
          error: "Failed to fetch database stats",
          totalExcuses: 0,
          totalUsage: 0,
          server_logs: logs, // Include logs in error response
        },
        { status: 500 }
    );
  }
}
