"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ExcuseRanking {
  id: string;
  excuse_text: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

interface RankingChartProps {
  rankings: ExcuseRanking[];
}

// Named export only. Do NOT default-export from this file.
export function RankingChart({ rankings }: RankingChartProps) {
  const chartData = rankings.map((excuse, index) => ({
    rank: `${index + 1}위`,
    name:
      excuse.excuse_text.length > 15
        ? excuse.excuse_text.substring(0, 15) + "..."
        : excuse.excuse_text,
    fullName: excuse.excuse_text,
    usage: excuse.usage_count,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-green-500 rounded-lg p-3 shadow-lg">
          <p className="text-green-400 font-bold">{`${label}`}</p>
          <p className="text-green-300 text-sm mb-1">
            "{payload[0].payload.fullName}"
          </p>
          <p className="text-yellow-400 font-bold">{`사용 횟수: ${payload[0].value}회`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gray-900/50 border-green-500/30 p-8">
      <h2 className="text-xl font-bold text-green-400 mb-6">
        &gt; 📈 사용량 차트 (TOP 10)
      </h2>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#22c55e20" />
            <XAxis
              dataKey="rank"
              stroke="#22c55e"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#22c55e" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="usage" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-center text-green-300 text-sm">
        &gt; 실시간 업데이트되는 사용량 통계
      </div>
    </Card>
  );
}
