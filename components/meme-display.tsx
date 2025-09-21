"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

const MEME_IMAGES = [
  "/frustrated-developer-at-computer.jpg",
  "/confused-programmer-looking-at-code.jpg",
  "/developer-shrugging-shoulders.jpg",
  "/programmer-drinking-coffee-stressed.jpg",
  "/developer-pointing-at-screen.jpg",
  "/confused-person-at-computer.jpg",
  "/programmer-with-question-marks.jpg",
  "/developer-looking-tired.jpg",
]

interface MemeDisplayProps {
  excuse: { text: string; id?: string }
}

export function MemeDisplay({ excuse }: MemeDisplayProps) {
  const [isRevealing, setIsRevealing] = useState(true)
  const [usageCount, setUsageCount] = useState<number | null>(null)
  const [hasCopied, setHasCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Reveal animation
    setTimeout(() => setIsRevealing(false), 1000)

    // Fetch usage count for this excuse
    fetchUsageCount()
  }, [excuse])

  const fetchUsageCount = async () => {
    try {
      const response = await fetch(`/api/excuse-stats?excuse=${encodeURIComponent(excuse.text)}`)
      const data = await response.json()
      setUsageCount(data.usage_count || 0)
    } catch (error) {
      console.error("Failed to fetch usage count:", error)
    }
  }

  const copyToClipboard = async () => {
    console.log("'Copy button clicked!', excuse");
    try {
      await navigator.clipboard.writeText(excuse.text)

      if (!hasCopied && excuse.id) {
        const response = await fetch("/api/track-excuse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            excuseId: excuse.id,
          }),
        })

        if (response.ok) {
          setHasCopied(true)
          setUsageCount((prev) => (prev || 0) + 1)
        } else {
          const errorData = await response.json();
          console.error("Failed to track excuse:", errorData);
        }
      }

      toast({
        title: "복사가 완료되었습니다!",
        description: "핑계가 클립보드에 복사되었습니다.",
      })
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "클립보드 복사에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-gray-900/50 border-green-500/30 p-8">
        <div className="text-center mb-6">
          <Badge className="bg-green-600 text-black font-bold mb-4">핑계 생성 완료!</Badge>
          <h2 className="text-2xl font-bold text-green-400 mb-4">&gt; 결과 출력</h2>
        </div>

        <div className="flex justify-center">
          <div
            className={`transition-all duration-1000 delay-300 ${isRevealing ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0"} max-w-2xl w-full`}
          >
            <div className="bg-black border-2 border-green-500 rounded-lg p-8 min-h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="text-green-300 text-sm mb-2">&gt; 생성된 핑계:</div>
                <div className="text-xl md:text-2xl font-bold text-yellow-400 mb-4">"{excuse.text}"</div>
                <div className="text-green-300 text-xs">&gt; 복사하여 즉시 사용 가능</div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mt-8 transition-all duration-1000 delay-600 ${isRevealing ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"}`}
        >
          <div className="flex justify-center">
            <Button
              onClick={copyToClipboard}
              className={`font-bold px-8 py-3 text-lg ${
                hasCopied
                  ? "bg-gray-600 hover:bg-gray-500 text-gray-300" // Different style for already copied
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              📋 {hasCopied ? "복사됨" : "복사하기"} {/* Show different text if already copied */}
            </Button>
          </div>
        </div>

        {/* Usage Stats */}
        <div
          className={`mt-6 text-center transition-all duration-1000 delay-900 ${isRevealing ? "opacity-0" : "opacity-100"}`}
        >
          <div className="text-green-300 text-sm">
            &gt; 이 핑계는 지금까지 <span className="text-yellow-400 font-bold">{usageCount || 0}</span>번
            복사되었습니다 {/* Changed from "사용" to "복사" */}
          </div>
          <div className="text-green-500 text-xs mt-1">&gt; 실시간 랭킹에서 순위를 확인해보세요!</div>
        </div>
      </Card>
    </div>
  )
}
