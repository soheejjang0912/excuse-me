"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UserExcuse {
  id: string
  nickname: string
  excuse_text: string
  is_approved: boolean
  created_at: string
}

export default function AdminPage() {
  const [excuses, setExcuses] = useState<UserExcuse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPendingExcuses()
  }, [])

  const fetchPendingExcuses = async () => {
    try {
      const response = await fetch("/api/admin/pending-excuses")
      if (response.ok) {
        const data = await response.json()
        setExcuses(data)
      }
    } catch (error) {
      console.error("Error fetching excuses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch("/api/admin/approve-excuse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, action: "approve" }),
      })

      if (response.ok) {
        setExcuses(excuses.filter((excuse) => excuse.id !== id))
      }
    } catch (error) {
      console.error("Error approving excuse:", error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch("/api/admin/approve-excuse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, action: "reject" }),
      })

      if (response.ok) {
        setExcuses(excuses.filter((excuse) => excuse.id !== id))
      }
    } catch (error) {
      console.error("Error rejecting excuse:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">&gt; 로딩 중...</div>
          <div className="animate-pulse">|</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">&gt; 관리자 패널</h1>
          <p className="text-green-300">승인 대기 중인 핑계: {excuses.length}개</p>
        </div>

        {excuses.length === 0 ? (
          <Card className="bg-gray-900/50 border-green-500/30 p-8 text-center">
            <div className="text-2xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-green-400 mb-2">모든 검토 완료</h3>
            <p className="text-green-300">승인 대기 중인 핑계가 없습니다.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {excuses.map((excuse) => (
              <Card key={excuse.id} className="bg-gray-900/50 border-green-500/30 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        {excuse.nickname}
                      </Badge>
                      <span className="text-green-600 text-sm">
                        {new Date(excuse.created_at).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    <p className="text-green-300 text-lg">{excuse.excuse_text}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(excuse.id)}
                    className="bg-green-600 hover:bg-green-500 text-black font-bold"
                  >
                    승인
                  </Button>
                  <Button
                    onClick={() => handleReject(excuse.id)}
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    거절
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
