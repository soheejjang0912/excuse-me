import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { id, action } = await request.json()

    if (!id || !action) {
      return NextResponse.json({ error: "ID and action are required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    if (action === "approve") {
      const { error } = await supabase
        .from("excuses")
        .update({
          is_approved: true,
          approved_at: new Date().toISOString(),
          approved_by: "admin",
        })
        .eq("id", id)

      if (error) {
        console.error("Error approving excuse:", error)
        return NextResponse.json({ error: "Failed to approve excuse" }, { status: 500 })
      }
    } else if (action === "reject") {
      const { error } = await supabase.from("excuses").delete().eq("id", id)

      if (error) {
        console.error("Error rejecting excuse:", error)
        return NextResponse.json({ error: "Failed to reject excuse" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in approve-excuse API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
