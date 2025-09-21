import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// 동적 라우트 강제 + 캐시 비활성화
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const excuse = searchParams.get("excuse")

    if (!excuse) {
      return NextResponse.json({ error: "Excuse parameter is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("excuses")
      .select("usage_count")
      .eq("excuse_text", excuse)
      .limit(1)

    if (error) {
      console.error("Error fetching excuse stats:", error)
      return NextResponse.json(
        {
          error: "Failed to fetch excuse stats",
          usage_count: 0,
        },
        { status: 500 },
      )
    }

    const usageCount = (data && data.length > 0) ? data[0].usage_count : 0;

    return NextResponse.json({
      usage_count: usageCount,
      success: true,
    })
  } catch (error) {
    console.error("Error processing request in excuse-stats:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        usage_count: 0,
      },
      { status: 500 },
    )
  }
}
