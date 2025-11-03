import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = (cb: FrameRequestCallback) => {
    return setTimeout(cb, 0) as unknown as number;
};

global.cancelAnimationFrame = (id: number) => {
    clearTimeout(id);
};

// Mock SVG methods that D3 uses
if (typeof SVGElement !== 'undefined') {
    // @ts-ignore
    SVGElement.prototype.getBBox = jest.fn(() => ({
        x: 0,
        y: 0,
        width: 100,
        height: 100
    }));

    // @ts-ignore
    SVGElement.prototype.getComputedTextLength = jest.fn(() => 100);
}

