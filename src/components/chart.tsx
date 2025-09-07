'use client';

import * as React from 'react';
import { cn } from '../utils';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface ChartProps {
  data: ChartData;
  type: 'bar' | 'line' | 'scatter';
  title?: string;
  className?: string;
  width?: number;
  height?: number;
}

export const Chart: React.FC<ChartProps> = ({
  data,
  type,
  title,
  className,
  width = 400,
  height = 300
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Simple chart rendering (in a real implementation, you'd use a charting library)
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw data (simplified bar chart)
    if (type === 'bar' && data.datasets.length > 0) {
      const dataset = data.datasets[0];
      const barWidth = chartWidth / data.labels.length;
      const maxValue = Math.max(...dataset.data);

      dataset.data.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + index * barWidth;
        const y = height - padding - barHeight;

        ctx.fillStyle = dataset.backgroundColor || '#3b82f6';
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
      });
    }

    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    data.labels.forEach((label, index) => {
      const x = padding + index * (chartWidth / data.labels.length) + (chartWidth / data.labels.length) / 2;
      ctx.fillText(label, x, height - padding + 20);
    });

  }, [data, type, width, height]);

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {title && (
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
      )}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border rounded"
      />
    </div>
  );
};
