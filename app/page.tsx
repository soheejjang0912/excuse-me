"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExcuseSubmissionForm } from "@/components/excuse-submission-form";

export default function HomePage() {
  const [isTyping, setIsTyping] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const [dbStats, setDbStats] = useState({ totalExcuses: 0, totalUsage: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const fullText = "버그 핑계 뽑기 시스템 v1.0";

  // Hydration-safe: render background only after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate background dots once on client (no SSR mismatch)
  const dots = useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: 50 }).map((_, i) => ({
      key: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      char: Math.random() > 0.5 ? "1" : "0",
    }));
  }, [mounted]);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDatabaseStats();
  }, []);

  const fetchDatabaseStats = async () => {
    try {
      const response = await fetch("/api/database-stats");
      if (response.ok) {
        const data = await response.json();
        setDbStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch database stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      {/* Matrix-style background effect */}
      {mounted && (
        <div className="fixed inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-black"></div>
          {dots.map((d) => (
            <div
              key={d.key}
              className="absolute text-green-500 text-xs animate-pulse"
              style={{ left: d.left, top: d.top, animationDelay: d.delay }}
            >
              {d.char}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Terminal Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-green-300">terminal@developer:~$</span>
          </div>

          <div className="text-2xl md:text-4xl font-bold mb-2">
            <span className="text-green-400">&gt; </span>
            {displayText}
            {isTyping && <span className="animate-pulse">|</span>}
          </div>

          <div className="text-green-300 text-sm mb-6">
            <p>&gt; 개발자를 위한 완벽한 변명 생성기</p>
            <p>&gt; 실시간 랭킹 시스템 탑재</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left Panel - Main Action */}
          <Card className="bg-gray-900/50 border-green-500/30 p-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🎲</div>
                <h2 className="text-2xl font-bold text-green-400 mb-2">
                  핑계 뽑기 시작
                </h2>
                <p className="text-green-300 text-sm">
                  완벽한 개발자 변명을 랜덤으로 생성합니다
                </p>
              </div>

              <Link href="/generator">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-500 text-black font-bold text-lg px-8 py-4 animate-pulse"
                >
                  &gt; 핑계 뽑기 실행_
                </Button>
              </Link>
            </div>
          </Card>

          {/* Right Panel - Stats */}
          <Card className="bg-gray-900/50 border-green-500/30 p-8">
            <h3 className="text-xl font-bold text-green-400 mb-4">
              &gt; 시스템 상태
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-green-300">총 핑계 데이터베이스:</span>
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-400"
                >
                  {statsLoading ? "로딩중..." : `${dbStats.totalExcuses}개`}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-green-300">총 핑계 사용량:</span>
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-400"
                >
                  {statsLoading ? "집계중..." : `${dbStats.totalUsage}회`}
                </Badge>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/rankings">
                <Button
                  variant="outline"
                  className="w-full border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
                >
                  &gt; 실시간 랭킹 보기
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        <div className="mb-12">
          <ExcuseSubmissionForm />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gray-900/30 border-green-500/20 p-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🎲</div>
              <h4 className="font-bold text-green-400 mb-2">운명 같은 핑계</h4>
              <p className="text-green-300 text-sm">클릭할 때마다 새로운 변명 등장</p>
            </div>
          </Card>

          <Card className="bg-gray-900/30 border-green-500/20 p-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="font-bold text-green-400 mb-2">실시간 랭킹</h4>
              <p className="text-green-300 text-sm">가장 인기있는 핑계 추적</p>
            </div>
          </Card>

          <Card className="bg-gray-900/30 border-green-500/20 p-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🚀</div>
              <h4 className="font-bold text-green-400 mb-2">즉시 공유</h4>
              <p className="text-green-300 text-sm">복사하기 기능 제공</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
