import { useEffect } from 'react';

/**
 * Hook to handle chart resize on window resize
 */
export function useChartResize(chartRef: React.RefObject<HTMLDivElement | null>) {
    useEffect(() => {
        if (!chartRef.current) return;

        const handleResize = () => {
            if (chartRef.current) {
                // Trigger resize event for chart components
                const event = new Event('resize');
                window.dispatchEvent(event);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [chartRef]);
}
