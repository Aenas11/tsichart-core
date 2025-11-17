import moment from 'moment';
import '../../../packages/pikaday/css/pikaday.css';

// Import Pikaday as a namespace to handle UMD module
import * as pikadayNamespace from '../../../packages/pikaday/pikaday.js';

// Ensure moment is available globally for Pikaday
if (typeof window !== 'undefined') {
    (window as any).moment = moment;
}

// Get Pikaday from the module or window
// The UMD wrapper will execute and either:
// 1. Return the constructor via module.exports (Rollup/CommonJS)
// 2. Attach it to window.Pikaday (Browser/UMD)
let Pikaday: any = null;

if (typeof window !== 'undefined') {
    // Check window first (UMD attached it there)
    if ((window as any).Pikaday) {
        Pikaday = (window as any).Pikaday;
    }
    // Check if imported as default (CommonJS module.exports)
    else if ((pikadayNamespace as any).default && typeof (pikadayNamespace as any).default === 'function') {
        Pikaday = (pikadayNamespace as any).default;
        (window as any).Pikaday = Pikaday;
    }
    // Check if it's the namespace itself (rare)
    else if (typeof pikadayNamespace === 'function') {
        Pikaday = pikadayNamespace;
        (window as any).Pikaday = Pikaday;
    }
    // Try any other property that might be the constructor
    else if (pikadayNamespace) {
        const possiblePikaday = Object.values(pikadayNamespace).find(val => typeof val === 'function');
        if (possiblePikaday) {
            Pikaday = possiblePikaday;
            (window as any).Pikaday = Pikaday;
        }
    }
}

// Declare Pikaday types
declare global {
    interface Window {
        Pikaday: any;
        moment: any;
    }
}

// Export a function to safely create Pikaday instances
export function createPikaday(options: any) {
    if (typeof window === 'undefined') {
        console.warn('Pikaday requires a browser environment');
        return null;
    }

    // Try multiple sources for Pikaday
    const PikadayConstructor = Pikaday || (window as any).Pikaday;

    if (!PikadayConstructor) {
        console.error('Pikaday not available. Make sure pikaday.js is loaded.');
        console.error('Failed to create Pikaday calendar. Check moment.js availability.');
        return null;
    }

    if (!moment || !(window as any).moment) {
        console.error('Moment.js not available. Pikaday requires moment.js.');
        console.error('Failed to create Pikaday calendar. Check moment.js availability.');
        return null;
    }

    try {
        return new PikadayConstructor(options);
    } catch (error) {
        console.error('Failed to create Pikaday instance:', error);
        console.error('Failed to create Pikaday calendar. Check moment.js availability.');
        return null;
    }
}

export { moment };