"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ExcuseRanking {
  id: string;
  excuse_text: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export default function RankingsPage() {
  const [rankings, setRankings] = useState<ExcuseRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsage, setTotalUsage] = useState(0);

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      const response = await fetch("/api/rankings");
      const data = await response.json();
      setRankings(data.rankings || []);
      setTotalUsage(data.totalUsage || 0);
    } catch (error) {
      console.error("Failed to fetch rankings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `${rank}위`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-400 border-yellow-400";
      case 2:
        return "text-gray-300 border-gray-300";
      case 3:
        return "text-orange-400 border-orange-400";
      default:
        return "text-green-400 border-green-400";
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Terminal Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 text-green-300">
            ranking-system@database:~$
          </span>
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
          실시간 핑계 랭킹 시스템
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-green-500/30 p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-green-400">
                {totalUsage}
              </div>
              <div className="text-green-300 text-sm">총 사용 횟수</div>
            </div>
          </Card>

          <Card className="bg-gray-900/50 border-green-500/30 p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-green-400">
                {rankings.length}
              </div>
              <div className="text-green-300 text-sm">등록된 핑계</div>
            </div>
          </Card>
        </div>

        {loading ? (
          <Card className="bg-gray-900/50 border-green-500/30 p-8">
            <div className="text-center">
              <div className="text-green-400 animate-pulse">
                &gt; 랭킹 데이터 로딩중...
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Top 3 Podium */}
            <Card className="bg-gray-900/50 border-green-500/30 p-8">
              <h2 className="text-xl font-bold text-green-400 mb-6 text-center">
                &gt; 🏆 TOP 3 명예의 전당
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {rankings.slice(0, 3).map((excuse, index) => {
                  const rank = index + 1;
                  return (
                    <Card
                      key={excuse.id}
                      className={`bg-black border-2 p-6 ${getRankColor(
                        rank
                      )} transition-all hover:scale-105`}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">{getRankIcon(rank)}</div>
                        <div
                          className={`text-lg font-bold mb-3 ${
                            getRankColor(rank).split(" ")[0]
                          }`}
                        >
                          {rank}위
                        </div>
                        <div className="text-green-300 text-sm mb-3 min-h-[40px] flex items-center justify-center">
                          "{excuse.excuse_text}"
                        </div>
                        <Badge
                          className={`${
                            getRankColor(rank).split(" ")[0]
                          } bg-transparent border`}
                        >
                          {excuse.usage_count}회 사용
                        </Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>

            {/* Full Rankings List */}
            <Card className="bg-gray-900/50 border-green-500/30 p-8">
              <h2 className="text-xl font-bold text-green-400 mb-6">
                &gt; 📋 전체 랭킹 리스트
              </h2>

              <div className="space-y-3">
                {rankings.map((excuse, index) => {
                  const rank = index + 1;
                  const percentage =
                    totalUsage > 0
                      ? (excuse.usage_count / totalUsage) * 100
                      : 0;

                  return (
                    <div
                        key={excuse.id}
                        className="bg-black border border-green-500/20 rounded-lg p-4 hover:border-green-500/50 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        {/* 왼쪽: 순위 + 멘트 */}
                        <div className="flex items-start gap-3 sm:items-center mb-3 sm:mb-0">
                          <div
                              className={`text-lg font-bold min-w-[52px] ${getRankColor(rank).split(" ")[0]}`}
                          >
                            {rank <= 3 ? getRankIcon(rank) : `${rank}위`}
                          </div>
                          <div className="text-green-300 leading-snug">
                            "{excuse.excuse_text}"
                          </div>
                        </div>

                        {/* 오른쪽: 횟수/퍼센트/바 (모바일 줄바꿈) */}
                        <div className="flex items-center gap-3">
                          {/* 횟수 */}
                          <div className="text-green-400 font-bold">
                            {excuse.usage_count}회
                          </div>

                          {/* 퍼센트 */}
                          <div className="text-green-300 text-xs">
                            {percentage.toFixed(1)}%
                          </div>

                          {/* Usage Bar (모바일 전용) */}
                          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden block sm:hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-700"
                                style={{ width: `${Math.min(Math.max(percentage, 2), 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Link href="/generator">
                <Button className="bg-green-600 hover:bg-green-500 text-black font-bold">
                  &gt; 핑계 뽑으러 가기
                </Button>
              </Link>

              <Button
                onClick={fetchRankings}
                variant="outline"
                className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
              >
                🔄 새로고침
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
