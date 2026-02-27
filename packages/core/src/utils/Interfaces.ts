export interface HorizontalMarker {
    value: number;
    color: string;
    condition: 'Greater Than' | 'Less Than';
    opacity?: number;
    label?: string;
}