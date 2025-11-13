import moment from 'moment';
import pikadayModule from '../../../packages/pikaday/pikaday.js';
import '../../../packages/pikaday/css/pikaday.css';

// Ensure moment is available globally for Pikaday
if (typeof window !== 'undefined') {
    (window as any).moment = moment;
}

// Get Pikaday from the module or window
let Pikaday: any = null;

if (typeof window !== 'undefined') {
    // Pikaday UMD module should have attached itself to window
    // or returned itself as the module export
    if ((window as any).Pikaday) {
        Pikaday = (window as any).Pikaday;
    } else if (typeof pikadayModule === 'function') {
        // CommonJS/ES module export
        Pikaday = pikadayModule;
        (window as any).Pikaday = Pikaday;
    } else if (pikadayModule && (pikadayModule as any).default) {
        // ES module default export
        Pikaday = (pikadayModule as any).default;
        (window as any).Pikaday = Pikaday;
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