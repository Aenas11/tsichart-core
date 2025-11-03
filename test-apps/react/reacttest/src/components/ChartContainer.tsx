import { useRef, type ReactNode } from 'react';
import { useChartResize } from '../hooks/useChartResize';

interface ChartContainerProps {
    title: string;
    description?: string;
    children: ReactNode;
    height?: string;
}

export function ChartContainer({
    title,
    description,
    children,
    height = '400px',
}: ChartContainerProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    useChartResize(containerRef);

    return (
        <div className="chart-container" ref={containerRef}>
            <div className="chart-header">
                <h3>{title}</h3>
                {description && <p className="chart-description">{description}</p>}
            </div>
            <div className="chart-content" style={{ height }}>
                {children}
            </div>
        </div>
    );
}
