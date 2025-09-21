import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("excuses")
      .select("*")
      .eq("is_approved", false)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching pending excuses:", error)
      return NextResponse.json({ error: "Failed to fetch pending excuses" }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error in pending-excuses API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
