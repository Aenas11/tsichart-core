/**
 * Type declarations for CSS imports
 * This allows TypeScript to resolve CSS module imports without errors
 */

declare module 'tsichart-core/styles' {
    const styles: string;
    export default styles;
}

declare module 'tsichart-core/styles/*' {
    const styles: string;
    export default styles;
}

// Generic CSS module declarations
declare module '*.css' {
    const content: string;
    export default content;
}

declare module '*.scss' {
    const content: string;
    export default content;
}
