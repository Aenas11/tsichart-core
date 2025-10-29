import moment from 'moment';

// Ensure moment is available globally for Pikaday
if (typeof window !== 'undefined') {
    (window as any).moment = moment;
}

// Import Pikaday after ensuring moment is available
import '../../../packages/pikaday/pikaday.js';
import '../../../packages/pikaday/css/pikaday.css';

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

    const Pikaday = (window as any).Pikaday;
    if (!Pikaday) {
        console.error('Pikaday not available. Make sure pikaday.js is loaded.');
        return null;
    }

    if (!moment || !(window as any).moment) {
        console.error('Moment.js not available. Pikaday requires moment.js.');
        return null;
    }

    return new Pikaday(options);
}

export { moment };