"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ExcuseGeneratorProps {
  onGenerate: (excuse: { text: string; id?: string }) => void
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
}

export function ExcuseGenerator({ onGenerate, isGenerating, setIsGenerating }: ExcuseGeneratorProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [animationPhase, setAnimationPhase] = useState<"idle" | "spinning" | "slowing" | "result">("idle")
  const [allExcuses, setAllExcuses] = useState<Array<{ text: string; id?: string }>>([])
  const [totalExcuseCount, setTotalExcuseCount] = useState(0)
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    fetchApprovedExcuses()
  }, [])

  const fetchApprovedExcuses = async () => {
    try {
      const response = await fetch("/api/approved-excuses");
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const dbExcuses = await response.json();
      
      const excuseObjects = dbExcuses.map((e: any) => ({
        text: e.excuse_text,
        id: e.id,
      }));

      setAllExcuses(excuseObjects);
      setTotalExcuseCount(excuseObjects.length);
    } catch (error) {
      console.error("Failed to fetch any excuses:", error);
      setAllExcuses([]);
      setTotalExcuseCount(0);
    }
  };

  const startGeneration = () => {
    if (allExcuses.length === 0) {
      console.error("No excuses available to generate.");
      // Optionally, show a toast to the user
      return;
    }

    setIsGenerating(true)
    setAnimationPhase("spinning")

    // Fast spinning phase
    let spinCount = 0
    const maxSpins = 30 + Math.floor(Math.random() * 20) // 30-50 spins

    const spinInterval = setInterval(
      () => {
        setCurrentIndex(Math.floor(Math.random() * allExcuses.length))
        spinCount++

        if (spinCount > maxSpins * 0.7) {
          setAnimationPhase("slowing")
        }

        if (spinCount >= maxSpins) {
          clearInterval(spinInterval)

          // Final selection
          const finalIndex = Math.floor(Math.random() * allExcuses.length)
          setCurrentIndex(finalIndex)
          setAnimationPhase("result")

          setTimeout(() => {
            onGenerate(allExcuses[finalIndex])
            setIsGenerating(false)
          }, 1000)
        }
      },
      animationPhase === "slowing" ? 200 : 100,
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Gacha Machine UI */}
      <Card className="bg-gray-900/50 border-green-500/30 p-8 mb-8">
        <div className="text-center">
          <div className="mb-6">
            <div className="text-4xl mb-4">🎰</div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">핑계 가챠 머신</h2>
            <p className="text-green-300 text-sm">완벽한 개발자 변명을 뽑아보세요</p>
            {hasMounted && <p className="text-green-500 text-xs mt-1">총 {totalExcuseCount}개의 핑계 보유</p>}
          </div>

          {/* Slot Machine Display */}
          <div className="bg-black border-2 border-green-500 rounded-lg p-6 mb-6 min-h-[120px] flex items-center justify-center">
            <div
              className={`text-xl md:text-2xl text-green-400 text-center transition-all duration-300 ${
                isGenerating ? "animate-pulse" : ""
              }`}
            >
              {animationPhase === "idle" ? (
                <div>
                  <div className="text-green-300 mb-2">&gt; 시스템 대기중...</div>
                  <div className="text-sm text-green-500">버튼을 눌러 핑계를 생성하세요</div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-green-300 text-sm">
                    {animationPhase === "spinning" && "> 핑계 데이터베이스 검색중..."}
                    {animationPhase === "slowing" && "> 최적의 핑계 선별중..."}
                    {animationPhase === "result" && "> 핑계 생성 완료!"}
                  </div>
                  <div className={`font-bold ${animationPhase === "result" ? "text-yellow-400" : "text-green-400"}`}>
                    "{allExcuses[currentIndex]?.text}"
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={startGeneration}
            disabled={isGenerating || allExcuses.length === 0}
            size="lg"
            className={`font-bold text-lg px-8 py-4 transition-all duration-300 ${
              isGenerating
                ? "bg-yellow-600 hover:bg-yellow-500 text-black animate-pulse"
                : "bg-green-600 hover:bg-green-500 text-black"
            }`}
          >
            {isGenerating ? "> 생성중..." : "> 핑계 뽑기 실행!"}
          </Button>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="bg-gray-900/30 border-green-500/20 p-6">
        <h3 className="text-lg font-bold text-green-400 mb-4">&gt; 사용법</h3>
        <div className="space-y-2 text-green-300 text-sm">
          <p>1. "핑계 뽑기 실행!" 버튼을 클릭하세요</p>
          <p>2. 가챠 머신이 랜덤으로 핑계를 선택합니다</p>
          <p>3. 생성된 핑계가 표시됩니다</p>
          <p>4. 복사 버튼을 눌러 클립보드에 복사하세요</p>
          <p className="text-green-500">💡 커뮤니티가 제출한 핑계도 포함됩니다!</p>{" "}
          {/* Added info about user submissions */}
        </div>
      </Card>
    </div>
  )
}
