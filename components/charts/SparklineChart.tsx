// components/charts/SparklineChart.tsx
'use client';

import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[];
  positive: boolean;
  width?: number;
  height?: number;
}

export function SparklineChart({ data, positive, width = 100, height = 36 }: SparklineProps) {
  if (!data || data.length < 2) return <div style={{ width, height }} />;

  const chartData = data.map((v, i) => ({ v, i }));
  const color = positive ? '#00ffa3' : '#ff3e7f';

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
