"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ExcuseGenerator } from "@/components/excuse-generator"
import { MemeDisplay } from "@/components/meme-display"

export default function GeneratorPage() {
  const [currentExcuse, setCurrentExcuse] = useState<{ text: string; seq?: number } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const handleGenerate = async (excuse: { text: string; seq?: number }) => {
    setCurrentExcuse(excuse)
    setShowResult(true)

    // Note: tracking is now handled in MemeDisplay component when user copies
    // This prevents double counting and ensures accurate usage statistics
  }

  const resetGenerator = () => {
    setCurrentExcuse(null)
    setShowResult(false)
    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Terminal Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 text-green-300">excuse-generator@system:~$</span>
          <Link href="/" className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
            >
              &lt; 메인으로
            </Button>
          </Link>
        </div>

        <div className="text-2xl md:text-3xl font-bold mb-8 text-center">
          <span className="text-green-400">&gt; </span>
          핑계 생성 시스템 실행중...
        </div>

        {!showResult ? (
          <ExcuseGenerator onGenerate={handleGenerate} isGenerating={isGenerating} setIsGenerating={setIsGenerating} />
        ) : (
          <div className="space-y-8">
            <MemeDisplay excuse={currentExcuse!} />

            <div className="flex justify-center gap-4">
              <Button onClick={resetGenerator} className="bg-green-600 hover:bg-green-500 text-black font-bold">
                &gt; 다시 뽑기
              </Button>
              <Link href="/rankings">
                <Button
                  variant="outline"
                  className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
                >
                  &gt; 랭킹 보기
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
