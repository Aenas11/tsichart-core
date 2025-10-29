import { useState, useCallback } from 'react';

/**
 * Hook to manage chart data state
 */
export function useChartData<T>(initialData: T) {
    const [data, setData] = useState<T>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateData = useCallback((newData: T) => {
        setData(newData);
    }, []);

    const refreshData = useCallback(
        async (dataGenerator: () => T | Promise<T>) => {
            setIsLoading(true);
            setError(null);

            try {
                const newData = await Promise.resolve(dataGenerator());
                setData(newData);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return {
        data,
        isLoading,
        error,
        updateData,
        refreshData,
    };
}
