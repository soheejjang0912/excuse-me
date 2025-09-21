import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { nickname, excuse_text } = await request.json()

    if (!nickname || !excuse_text) {
      return NextResponse.json({ error: "Nickname and excuse text are required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { error } = await supabase.from("excuses").insert([
      {
        nickname: nickname.trim(),
        excuse_text: excuse_text.trim(),
        is_approved: false,
      },
    ])

    if (error) {
      console.error("Error inserting excuse:", error)
      return NextResponse.json({ error: "Failed to submit excuse" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in submit-excuse API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
