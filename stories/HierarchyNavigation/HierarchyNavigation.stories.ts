import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import HierarchyNavigation from '../../packages/core/src/components/HierarchyNavigation';

/**
 * Hardcoded hierarchy data that represents a realistic factory IoT scenario
 */

const MOCK_HIERARCHY_DATA = {
    // Root level - Factories
    '': {
        hierarchyNodes: {
            hitCount: 3,
            hits: [
                { name: 'Factory North', id: 'factory-north', cumulativeInstanceCount: 24 },
                { name: 'Factory South', id: 'factory-south', cumulativeInstanceCount: 18 },
                { name: 'Factory East', id: 'factory-east', cumulativeInstanceCount: 16 }
            ]
        },
        instances: {
            hitCount: 2,
            hits: [
                {
                    timeSeriesId: ['ROOT', 'WEATHER-01'],
                    name: 'Weather Station',
                    description: 'Main weather monitoring station',
                    id: 'instance-weather-01'
                },
                {
                    timeSeriesId: ['ROOT', 'POWER-01'],
                    name: 'Power Grid Monitor',
                    description: 'Main power consumption monitor',
                    id: 'instance-power-01'
                }
            ]
        }
    },

    // Factory North -> Buildings
    'Factory North': {
        hierarchyNodes: {
            hitCount: 2,
            hits: [
                { name: 'Building A', id: 'factory-north-building-a', cumulativeInstanceCount: 12 },
                { name: 'Building B', id: 'factory-north-building-b', cumulativeInstanceCount: 12 }
            ]
        },
        instances: {
            hitCount: 0,
            hits: []
        }
    },

    // Factory North -> Building A -> Production Lines
    'Factory North/Building A': {
        hierarchyNodes: {
            hitCount: 2,
            hits: [
                { name: 'Production Line 1', id: 'fn-ba-pl1', cumulativeInstanceCount: 6 },
                { name: 'Production Line 2', id: 'fn-ba-pl2', cumulativeInstanceCount: 6 }
            ]
        },
        instances: {
            hitCount: 0,
            hits: []
        }
    },

    // Factory North -> Building A -> Production Line 1 -> Sensors
    'Factory North/Building A/Production Line 1': {
        hierarchyNodes: {
            hitCount: 0,
            hits: []
        },
        instances: {
            hitCount: 6,
            hits: [
                {
                    timeSeriesId: ['FN', 'BA', 'PL1', 'TEMP-01'],
                    name: 'Temperature Sensor 1',
                    description: 'Monitors ambient temperature on production line 1',
                    id: 'instance-fn-ba-pl1-temp-01'
                },
                {
                    timeSeriesId: ['FN', 'BA', 'PL1', 'PRESS-01'],
                    name: 'Pressure Sensor 1',
                    description: 'Monitors hydraulic pressure on production line 1',
                    id: 'instance-fn-ba-pl1-press-01'
                },
                {
                    timeSeriesId: ['FN', 'BA', 'PL1', 'VIB-01'],
                    name: 'Vibration Sensor 1',
                    description: 'Detects vibration anomalies on production line 1',
                    id: 'instance-fn-ba-pl1-vib-01'
                },
                {
                    timeSeriesId: ['FN', 'BA', 'PL1', 'MOTOR-01'],
                    name: 'Motor RPM Monitor',
                    description: 'Tracks motor rotations per minute',
                    id: 'instance-fn-ba-pl1-motor-01'
                },
                {
                    timeSeriesId: ['FN', 'BA', 'PL1', 'ENERGY-01'],
                    name: 'Energy Meter',
                    description: 'Measures power consumption',
                    id: 'instance-fn-ba-pl1-energy-01'
                },
                {
                    timeSeriesId: ['FN', 'BA', 'PL1', 'QUALITY-01'],
                    name: 'Quality Control Sensor',
                    description: 'Monitors product quality metrics',
                    id: 'instance-fn-ba-pl1-quality-01'
                }
            ]
        }
    },

    // Factory North -> Building A -> Production Line 2 -> Sensors
    'Factory North/Building A/Production Line 2': {
        hierarchyNodes: {
            hitCount: 0,
            hits: []
        },
        instances: {
            hitCount: 6,
            hits: [
                {
                    timeSeriesId: ['FN', 'BA', 'PL2', 'TEMP-01'],
                    name: 'Temperature Sensor 2',
                    description: 'Monitors ambient temperature on production line 2',
                    id: 'instance-fn-ba-pl2-temp-01'
                },
                {
                    timeSeriesId: ['FN', 'BA', 'PL2', 'PRESS-01'],
                    name: 'Pressure Sensor 2',
                    description: 'Monitors hydraulic pressure on production line 2',
                    id: 'instance-fn-ba-pl2-press-01'
                },
                {
                    timeSeriesId: ['FN', 'BA', 'PL2', 'VIB-01'],
                    name: 'Vibration Sensor 2',
                    description: 'Detects vibration anomalies on production line 2',
                    id: 'instance-fn-ba-pl2-vib-01'
                },
                {
                    timeSeriesId: ['FN', 'BA', 'PL2', 'MOTOR-01'],
                    name: 'Motor RPM Monitor 2',
                    description: 'Tracks motor rotations per minute',
                    id: 'instance-fn-ba-pl2-motor-01'
                },
                {
                    timeSeriesId: ['FN', 'BA', 'PL2', 'ENERGY-01'],
                    name: 'Energy Meter 2',
                    description: 'Measures power consumption',
                    id: 'instance-fn-ba-pl2-energy-01'
                },
                {
                    timeSeriesId: ['FN', 'BA', 'PL2', 'FLOW-01'],
                    name: 'Flow Meter',
                    description: 'Monitors material flow rate',
                    id: 'instance-fn-ba-pl2-flow-01'
                }
            ]
        }
    },

    // Factory North -> Building B -> Production Lines
    'Factory North/Building B': {
        hierarchyNodes: {
            hitCount: 2,
            hits: [
                { name: 'Production Line 3', id: 'fn-bb-pl3', cumulativeInstanceCount: 6 },
                { name: 'Production Line 4', id: 'fn-bb-pl4', cumulativeInstanceCount: 6 }
            ]
        },
        instances: {
            hitCount: 0,
            hits: []
        }
    },

    'Factory North/Building B/Production Line 3': {
        hierarchyNodes: { hitCount: 0, hits: [] },
        instances: {
            hitCount: 6,
            hits: [
                { timeSeriesId: ['FN', 'BB', 'PL3', 'TEMP-01'], name: 'Temperature Sensor 3', description: 'Line 3 temperature monitor', id: 'instance-fn-bb-pl3-temp-01' },
                { timeSeriesId: ['FN', 'BB', 'PL3', 'PRESS-01'], name: 'Pressure Sensor 3', description: 'Line 3 pressure monitor', id: 'instance-fn-bb-pl3-press-01' },
                { timeSeriesId: ['FN', 'BB', 'PL3', 'HUM-01'], name: 'Humidity Sensor', description: 'Line 3 humidity monitor', id: 'instance-fn-bb-pl3-hum-01' },
                { timeSeriesId: ['FN', 'BB', 'PL3', 'SPEED-01'], name: 'Conveyor Speed', description: 'Line 3 conveyor belt speed', id: 'instance-fn-bb-pl3-speed-01' },
                { timeSeriesId: ['FN', 'BB', 'PL3', 'COUNT-01'], name: 'Product Counter', description: 'Line 3 product count', id: 'instance-fn-bb-pl3-count-01' },
                { timeSeriesId: ['FN', 'BB', 'PL3', 'WEIGHT-01'], name: 'Weight Sensor', description: 'Line 3 product weight', id: 'instance-fn-bb-pl3-weight-01' }
            ]
        }
    },

    'Factory North/Building B/Production Line 4': {
        hierarchyNodes: { hitCount: 0, hits: [] },
        instances: {
            hitCount: 6,
            hits: [
                { timeSeriesId: ['FN', 'BB', 'PL4', 'TEMP-01'], name: 'Temperature Sensor 4', description: 'Line 4 temperature monitor', id: 'instance-fn-bb-pl4-temp-01' },
                { timeSeriesId: ['FN', 'BB', 'PL4', 'PRESS-01'], name: 'Pressure Sensor 4', description: 'Line 4 pressure monitor', id: 'instance-fn-bb-pl4-press-01' },
                { timeSeriesId: ['FN', 'BB', 'PL4', 'ROBOT-01'], name: 'Robot Arm Monitor', description: 'Line 4 robotic arm telemetry', id: 'instance-fn-bb-pl4-robot-01' },
                { timeSeriesId: ['FN', 'BB', 'PL4', 'LASER-01'], name: 'Laser Cutter', description: 'Line 4 laser cutting monitor', id: 'instance-fn-bb-pl4-laser-01' },
                { timeSeriesId: ['FN', 'BB', 'PL4', 'WELD-01'], name: 'Welding Monitor', description: 'Line 4 welding quality', id: 'instance-fn-bb-pl4-weld-01' },
                { timeSeriesId: ['FN', 'BB', 'PL4', 'COOL-01'], name: 'Coolant Monitor', description: 'Line 4 coolant level and flow', id: 'instance-fn-bb-pl4-cool-01' }
            ]
        }
    },

    // Factory South
    'Factory South': {
        hierarchyNodes: {
            hitCount: 1,
            hits: [
                { name: 'Warehouse', id: 'factory-south-warehouse', cumulativeInstanceCount: 18 }
            ]
        },
        instances: {
            hitCount: 0,
            hits: []
        }
    },

    'Factory South/Warehouse': {
        hierarchyNodes: {
            hitCount: 3,
            hits: [
                { name: 'Zone A', id: 'fs-wh-zone-a', cumulativeInstanceCount: 6 },
                { name: 'Zone B', id: 'fs-wh-zone-b', cumulativeInstanceCount: 6 },
                { name: 'Zone C', id: 'fs-wh-zone-c', cumulativeInstanceCount: 6 }
            ]
        },
        instances: {
            hitCount: 0,
            hits: []
        }
    },

    'Factory South/Warehouse/Zone A': {
        hierarchyNodes: { hitCount: 0, hits: [] },
        instances: {
            hitCount: 6,
            hits: [
                { timeSeriesId: ['FS', 'WH', 'ZA', 'TEMP-01'], name: 'Zone A Temperature', description: 'Storage zone A temperature', id: 'instance-fs-wh-za-temp-01' },
                { timeSeriesId: ['FS', 'WH', 'ZA', 'HUM-01'], name: 'Zone A Humidity', description: 'Storage zone A humidity', id: 'instance-fs-wh-za-hum-01' },
                { timeSeriesId: ['FS', 'WH', 'ZA', 'DOOR-01'], name: 'Door Sensor A1', description: 'Zone A entry door status', id: 'instance-fs-wh-za-door-01' },
                { timeSeriesId: ['FS', 'WH', 'ZA', 'DOOR-02'], name: 'Door Sensor A2', description: 'Zone A exit door status', id: 'instance-fs-wh-za-door-02' },
                { timeSeriesId: ['FS', 'WH', 'ZA', 'LIGHT-01'], name: 'Lighting Control', description: 'Zone A lighting status', id: 'instance-fs-wh-za-light-01' },
                { timeSeriesId: ['FS', 'WH', 'ZA', 'OCCUP-01'], name: 'Occupancy Sensor', description: 'Zone A occupancy detection', id: 'instance-fs-wh-za-occup-01' }
            ]
        }
    },

    'Factory South/Warehouse/Zone B': {
        hierarchyNodes: { hitCount: 0, hits: [] },
        instances: {
            hitCount: 6,
            hits: [
                { timeSeriesId: ['FS', 'WH', 'ZB', 'TEMP-01'], name: 'Zone B Temperature', description: 'Cold storage temperature', id: 'instance-fs-wh-zb-temp-01' },
                { timeSeriesId: ['FS', 'WH', 'ZB', 'FREEZE-01'], name: 'Freezer Monitor', description: 'Freezer unit status', id: 'instance-fs-wh-zb-freeze-01' },
                { timeSeriesId: ['FS', 'WH', 'ZB', 'DEFROST-01'], name: 'Defrost Cycle', description: 'Defrost cycle monitor', id: 'instance-fs-wh-zb-defrost-01' },
                { timeSeriesId: ['FS', 'WH', 'ZB', 'ALARM-01'], name: 'Temperature Alarm', description: 'Critical temp alarm system', id: 'instance-fs-wh-zb-alarm-01' },
                { timeSeriesId: ['FS', 'WH', 'ZB', 'BACKUP-01'], name: 'Backup Power', description: 'Backup power status', id: 'instance-fs-wh-zb-backup-01' },
                { timeSeriesId: ['FS', 'WH', 'ZB', 'CO2-01'], name: 'CO2 Monitor', description: 'CO2 level monitoring', id: 'instance-fs-wh-zb-co2-01' }
            ]
        }
    },

    'Factory South/Warehouse/Zone C': {
        hierarchyNodes: { hitCount: 0, hits: [] },
        instances: {
            hitCount: 6,
            hits: [
                { timeSeriesId: ['FS', 'WH', 'ZC', 'FORKLIFT-01'], name: 'Forklift 1 Telemetry', description: 'Forklift 1 location and battery', id: 'instance-fs-wh-zc-fork-01' },
                { timeSeriesId: ['FS', 'WH', 'ZC', 'FORKLIFT-02'], name: 'Forklift 2 Telemetry', description: 'Forklift 2 location and battery', id: 'instance-fs-wh-zc-fork-02' },
                { timeSeriesId: ['FS', 'WH', 'ZC', 'DOCK-01'], name: 'Loading Dock 1', description: 'Dock 1 activity sensor', id: 'instance-fs-wh-zc-dock-01' },
                { timeSeriesId: ['FS', 'WH', 'ZC', 'DOCK-02'], name: 'Loading Dock 2', description: 'Dock 2 activity sensor', id: 'instance-fs-wh-zc-dock-02' },
                { timeSeriesId: ['FS', 'WH', 'ZC', 'SCALE-01'], name: 'Shipping Scale', description: 'Package weight scale', id: 'instance-fs-wh-zc-scale-01' },
                { timeSeriesId: ['FS', 'WH', 'ZC', 'SCANNER-01'], name: 'Barcode Scanner', description: 'Package scanning station', id: 'instance-fs-wh-zc-scanner-01' }
            ]
        }
    },

    // Factory East
    'Factory East': {
        hierarchyNodes: {
            hitCount: 1,
            hits: [
                { name: 'Testing Lab', id: 'factory-east-lab', cumulativeInstanceCount: 16 }
            ]
        },
        instances: {
            hitCount: 0,
            hits: []
        }
    },

    'Factory East/Testing Lab': {
        hierarchyNodes: {
            hitCount: 2,
            hits: [
                { name: 'Materials Testing', id: 'fe-lab-materials', cumulativeInstanceCount: 8 },
                { name: 'Quality Assurance', id: 'fe-lab-qa', cumulativeInstanceCount: 8 }
            ]
        },
        instances: {
            hitCount: 0,
            hits: []
        }
    },

    'Factory East/Testing Lab/Materials Testing': {
        hierarchyNodes: { hitCount: 0, hits: [] },
        instances: {
            hitCount: 8,
            hits: [
                { timeSeriesId: ['FE', 'LAB', 'MT', 'TENSILE-01'], name: 'Tensile Tester', description: 'Material tensile strength tester', id: 'instance-fe-lab-mt-tensile-01' },
                { timeSeriesId: ['FE', 'LAB', 'MT', 'COMPRESS-01'], name: 'Compression Tester', description: 'Material compression tester', id: 'instance-fe-lab-mt-compress-01' },
                { timeSeriesId: ['FE', 'LAB', 'MT', 'HARDNESS-01'], name: 'Hardness Tester', description: 'Material hardness measurement', id: 'instance-fe-lab-mt-hardness-01' },
                { timeSeriesId: ['FE', 'LAB', 'MT', 'SPECTRO-01'], name: 'Spectrometer', description: 'Material composition analysis', id: 'instance-fe-lab-mt-spectro-01' },
                { timeSeriesId: ['FE', 'LAB', 'MT', 'MICROSCOPE-01'], name: 'Digital Microscope', description: 'Surface analysis microscope', id: 'instance-fe-lab-mt-micro-01' },
                { timeSeriesId: ['FE', 'LAB', 'MT', 'XRAY-01'], name: 'X-Ray Scanner', description: 'Internal defect detection', id: 'instance-fe-lab-mt-xray-01' },
                { timeSeriesId: ['FE', 'LAB', 'MT', 'FATIGUE-01'], name: 'Fatigue Tester', description: 'Material fatigue testing', id: 'instance-fe-lab-mt-fatigue-01' },
                { timeSeriesId: ['FE', 'LAB', 'MT', 'THERMAL-01'], name: 'Thermal Analyzer', description: 'Thermal properties analyzer', id: 'instance-fe-lab-mt-thermal-01' }
            ]
        }
    },

    'Factory East/Testing Lab/Quality Assurance': {
        hierarchyNodes: { hitCount: 0, hits: [] },
        instances: {
            hitCount: 8,
            hits: [
                { timeSeriesId: ['FE', 'LAB', 'QA', 'CMM-01'], name: 'CMM Machine', description: 'Coordinate measuring machine', id: 'instance-fe-lab-qa-cmm-01' },
                { timeSeriesId: ['FE', 'LAB', 'QA', 'VISION-01'], name: 'Vision System', description: 'Automated visual inspection', id: 'instance-fe-lab-qa-vision-01' },
                { timeSeriesId: ['FE', 'LAB', 'QA', 'GAUGE-01'], name: 'Precision Gauge', description: 'Precision measurement gauge', id: 'instance-fe-lab-qa-gauge-01' },
                { timeSeriesId: ['FE', 'LAB', 'QA', 'LEAK-01'], name: 'Leak Tester', description: 'Pressurized leak detection', id: 'instance-fe-lab-qa-leak-01' },
                { timeSeriesId: ['FE', 'LAB', 'QA', 'ELECTRICAL-01'], name: 'Electrical Tester', description: 'Electrical safety testing', id: 'instance-fe-lab-qa-elec-01' },
                { timeSeriesId: ['FE', 'LAB', 'QA', 'NOISE-01'], name: 'Noise Monitor', description: 'Product noise level testing', id: 'instance-fe-lab-qa-noise-01' },
                { timeSeriesId: ['FE', 'LAB', 'QA', 'ENV-01'], name: 'Environmental Chamber', description: 'Environmental stress testing', id: 'instance-fe-lab-qa-env-01' },
                { timeSeriesId: ['FE', 'LAB', 'QA', 'LIFECYCLE-01'], name: 'Lifecycle Tester', description: 'Product lifecycle simulation', id: 'instance-fe-lab-qa-lifecycle-01' }
            ]
        }
    }
};

// Mock search function that returns hardcoded data based on path
function createMockSearchFunction() {
    return async (payload: { path: string[], hierarchy: any, searchTerm?: string, recursive?: boolean, includeInstances?: boolean }): Promise<any> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 200));

        // DEEP SEARCH MODE: If searchTerm and recursive are provided
        if (payload.searchTerm && payload.recursive) {
            return performDeepSearch(payload.searchTerm, payload.path);
        }

        // NAVIGATION MODE: Regular path-based navigation
        const pathKey = payload.path.join('/');
        const data = MOCK_HIERARCHY_DATA[pathKey];

        if (data) {
            return data;
        }

        // Return empty result if path not found
        return {
            hierarchyNodes: { hitCount: 0, hits: [] },
            instances: { hitCount: 0, hits: [] }
        };
    };
}

// Deep search implementation - searches across entire hierarchy
function performDeepSearch(searchTerm: string, basePath: string[] = []): any {
    const term = searchTerm.toLowerCase();
    const hierarchyResults: any[] = [];
    const instanceResults: any[] = [];

    // Search through all hierarchy data
    for (const [pathKey, data] of Object.entries(MOCK_HIERARCHY_DATA)) {
        const path = pathKey ? pathKey.split('/') : [];

        // Only search in the current context (basePath) and below
        if (basePath.length > 0) {
            const matchesBasePath = basePath.every((segment, idx) => path[idx] === segment);
            if (!matchesBasePath) continue;
        }

        // Search hierarchy nodes
        if (data.hierarchyNodes?.hits) {
            for (const node of data.hierarchyNodes.hits) {
                if (node.name.toLowerCase().includes(term)) {
                    hierarchyResults.push({
                        ...node,
                        path: [...path, node.name], // Full path from root
                    });
                }
            }
        }

        // Search instances
        if (data.instances?.hits) {
            for (const instance of data.instances.hits) {
                const searchableText = `${instance.name} ${instance.description || ''} ${instance.id || ''}`.toLowerCase();
                if (searchableText.includes(term)) {
                    instanceResults.push({
                        ...instance,
                        hierarchyPath: path, // Path to parent hierarchy
                    });
                }
            }
        }
    }

    return {
        hierarchyNodes: {
            hitCount: hierarchyResults.length,
            hits: hierarchyResults
        },
        instances: {
            hitCount: instanceResults.length,
            hits: instanceResults
        }
    };
}

const meta: Meta = {
    title: 'Components/HierarchyNavigation',
    component: 'hierarchy-navigation',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# HierarchyNavigation Component

A hierarchical tree navigation component for browsing time series instances organized in a hierarchy structure.

## Key Features
- **Hierarchical Tree View**: Navigate through nested hierarchy levels
- **Instance Selection**: Click on instances to select them
- **Expandable/Collapsible Nodes**: Expand hierarchy nodes to see children
- **Deep Search Functionality**: Search across the entire hierarchy tree (NEW ✨)
- **Multi-selection**: Select multiple instances
- **Theming**: Support for light and dark themes
- **Keyboard Navigation**: Full accessibility support with arrow keys

## New: Deep Search 🔍

The component now supports **deep search** that searches across the entire hierarchy tree:
- Type 2+ characters to trigger search
- View results in flat list with breadcrumb paths
- Search terms are highlighted in yellow
- Server-side search pattern for large datasets
- Automatic debouncing (250ms) and request cancellation

Try the "Deep Search Functionality" story to see it in action!

## Usage Example

\`\`\`typescript
import TsiClient from 'tsichart-core';

const tsiClient = new TsiClient();
const hierarchyNav = new tsiClient.HierarchyNavigation(containerElement);

// Mock search function that supports deep search
const searchFunction = async (payload) => {
    // Deep search mode
    if (payload.searchTerm && payload.recursive) {
        return {
            hierarchyNodes: { 
                hitCount: 5, 
                hits: [
                    { name: 'Temperature Sensors', path: ['Factory', 'Building A'], cumulativeInstanceCount: 12 }
                ] 
            },
            instances: { 
                hitCount: 10, 
                hits: [
                    { name: 'Temp Sensor 01', hierarchyPath: ['Factory', 'Building A', 'Floor 1'], id: 'ts1' }
                ]
            }
        };
    }
    
    // Navigation mode
    return {
        hierarchyNodes: { hitCount: 5, hits: [...] },
        instances: { hitCount: 10, hits: [...] }
    };
};

// Render the hierarchy navigation
await hierarchyNav.render(searchFunction, {
    theme: 'light',
    onInstanceClick: (instance) => {
        console.log('Instance clicked:', instance);
    }
}, []); // empty array for preselected IDs
\`\`\`

## Accessibility & Interaction
- **Keyboard Navigation**: Use Arrow Up/Down to move, Arrow Right to expand or move into children, Arrow Left to collapse or move to parent. Enter or Space toggles expand/select depending on focused item.
- **Search**: The search box uses a 250ms debounce to reduce work while typing. Server requests are protected from race conditions (stale responses are ignored).
- **ARIA Support**: Proper ARIA labels, roles, and focus management for screen readers.
                `
            }
        }
    },
    argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
            description: 'Visual theme for the component',
            table: { defaultValue: { summary: 'light' } }
        },
        autocompleteEnabled: {
            control: { type: 'boolean' },
            description: 'Enable/disable autocomplete suggestions dropdown',
            table: { defaultValue: { summary: 'true' } }
        },
        preselectedIds: {
            control: { type: 'object' },
            description: 'Array of instance IDs to pre-select',
            table: { defaultValue: { summary: '[]' } }
        }
    }
};

export default meta;

type Story = StoryObj;

// Helper function to render HierarchyNavigation
async function renderHierarchyNavigation(container: HTMLElement, options: any = {}) {
    container.innerHTML = '';
    container.style.width = '400px';
    container.style.height = '600px';
    container.style.border = options.theme === 'dark' ? '1px solid #444' : '1px solid #ddd';
    container.style.borderRadius = '4px';
    container.style.overflow = 'hidden';

    try {
        console.log('Rendering HierarchyNavigation with options:', options);

        // Create HierarchyNavigation instance
        const hierarchyNav = new HierarchyNavigation(container);

        // Create mock search function
        const mockSearchFunction = createMockSearchFunction();

        // Options for the hierarchy navigation
        const hierarchyOptions = {
            theme: options.theme || 'light',
            autocompleteEnabled: options.autocompleteEnabled !== undefined ? options.autocompleteEnabled : true,
            onInstanceClick: (instance: any) => {
                console.log('Instance clicked:', instance);
                alert(`Instance selected:\nName: ${instance.name}\nID: ${instance.id}\nDescription: ${instance.description}`);
            }
        };

        // Preselected instance IDs (empty by default)
        const preselectedIds: string[] = options.preselectedIds || [];

        // Render the component and wait for initial render to complete
        await hierarchyNav.render(mockSearchFunction, hierarchyOptions, preselectedIds);

        // NOTE: instruction overlay removed — instructions are now in the story documentation

        return hierarchyNav;
    } catch (error: any) {
        console.error('HierarchyNavigation rendering error:', error);
        container.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
            <h3>Error rendering HierarchyNavigation</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><small>Check browser console for more details</small></p>
        </div>`;
    }
}

// Helper function to create a story
function createHierarchyNavigationStory(containerStyle: string = '') {
    return (args: any) => {
        const chartId = 'hierarchy-' + Math.random().toString(36).substring(7);

        // Wait a tick for Storybook to attach the element, then render the component
        setTimeout(() => {
            const container = document.getElementById(chartId);
            if (container) {
                // fire and forget (renderHierarchyNavigation is async)
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                renderHierarchyNavigation(container, args);
            }
        }, 50);

        return html`
            <div style="${containerStyle}">
                <div id="${chartId}" style="height: 100%; width: 100%;"></div>
            </div>
        `;
    };
}

export const Default: Story = {
    name: '1. Basic Navigation',
    parameters: {
        docs: {
            description: {
                story: 'Default hierarchy navigation. Click hierarchy nodes (with caret icons) to expand/collapse. Click sensor instances to select them (shows alert). Includes debounced search, keyboard navigation (Arrow keys + Enter), and improved ARIA attributes for accessibility.'
            }
        }
    },
    args: {
        theme: 'light'
    },
    render: createHierarchyNavigationStory('height: 600px; width: 400px; padding: 20px;')
};

export const DarkTheme: Story = {
    name: '2. Dark Theme',
    parameters: {
        docs: {
            description: {
                story: 'Same hierarchy with dark theme. Notice the different styling for nodes, text, and background.'
            }
        }
    },
    args: {
        theme: 'dark'
    },
    render: createHierarchyNavigationStory('height: 600px; width: 400px; padding: 20px; background: #1a1a1a;')
};

export const WithPreselection: Story = {
    name: '3. Pre-Selected Instances (Multi-Select)',
    parameters: {
        docs: {
            description: {
                story: '**Key Feature**: 5 sensors pre-selected from different locations (highlighted in blue). Click any sensor to toggle selection on/off. This demonstrates the multi-selection capability.'
            }
        }
    },
    args: {
        theme: 'light',
        preselectedIds: [
            'instance-fn-ba-pl1-temp-01',
            'instance-fn-ba-pl2-press-01',
            'instance-fs-wh-za-temp-01',
            'instance-fs-wh-zb-temp-01',
            'instance-fe-lab-mt-tensile-01'
        ]
    },
    render: createHierarchyNavigationStory('height: 700px; width: 450px; padding: 20px;')
};

export const DeepSearch: Story = {
    name: '4. Deep Search Functionality 🔍',
    parameters: {
        docs: {
            description: {
                story: `
## Deep Search - Search Entire Hierarchy

This story demonstrates the **new deep search functionality** that searches across the entire hierarchy tree, not just currently visible nodes.

### How to Use Deep Search

1. **Type in the search box** - Start typing to search (minimum 2 characters)
2. **Automatic debouncing** - Search triggers after 250ms of no typing
3. **View results** - Results appear in a flat list with breadcrumb paths
4. **Click results** - Click instances to select them, or hierarchy nodes to navigate

### Try These Example Searches

- \`"temperature"\` - Find all temperature sensors across all factories (12+ results)
- \`"pressure"\` - Find all pressure monitoring sensors (8+ results)
- \`"motor"\` - Find motor-related sensors in different production lines
- \`"energy"\` - Find energy meters across facilities
- \`"quality"\` - Find quality control sensors
- \`"vibration"\` - Find vibration sensors
- \`"flow"\` - Find flow meters
- \`"production"\` - Find hierarchy nodes containing "production"
- \`"warehouse"\` - Find warehouse-related items
- \`"lab"\` - Find laboratory equipment

### Key Features

✅ **Breadcrumb Paths** - Each result shows its full location in the hierarchy  
✅ **Highlighted Matches** - Search terms are highlighted in yellow  
✅ **Instance Context** - Shows descriptions and hierarchy location  
✅ **Selection Persistence** - Selected items remain selected when switching between search/navigation  
✅ **Keyboard Navigation** - Use Tab/Arrow keys to navigate, Enter/Space to select  
✅ **Performance Optimized** - Debounced input, request cancellation for stale queries  

### Search Behavior

- **Empty input**: Returns to normal navigation view
- **1 character**: No search (too short)
- **2+ characters**: Triggers deep search across entire tree
- **Fast typing**: Only the last search query is processed (older requests ignored)

### Result Types

**Hierarchy Nodes** show:
- Full breadcrumb path (e.g., "Factory North > Building A")
- Node name with highlighted search term
- Total instance count in that branch

**Instance Results** show:
- Full breadcrumb path to parent
- Instance name with highlighted search term  
- Description (if available)
- Selection state (visual indicator if selected)

### Clear Search

- **Clear the input**: Automatically returns to navigation mode
- **Press ESC**: Clears the search box (standard browser behavior)

### Technical Details

This implementation uses:
- **Server-side search** pattern (simulated with mock data)
- **Request payload**: \`{ path, searchTerm, recursive: true, includeInstances: true }\`
- **Response format**: Flattened results with full path arrays
- **Stale request cancellation**: Uses request IDs to ignore outdated responses

See the [SEARCH_API.md](https://github.com/Aenas11/tsichart-core/blob/feature/components/packages/core/src/components/HierarchyNavigation/SEARCH_API.md) documentation for implementation details.
                `
            }
        }
    },
    args: {
        theme: 'light'
    },
    render: createHierarchyNavigationStory('height: 700px; width: 500px; padding: 20px;')
};

export const DeepSearchDark: Story = {
    name: '5. Deep Search - Dark Theme 🌙',
    parameters: {
        docs: {
            description: {
                story: `
Same deep search functionality with dark theme. Try searching for:
- \`"sensor"\` - Find all sensor types
- \`"monitor"\` - Find all monitoring devices
- \`"meter"\` - Find all meters (energy, flow, etc.)
- \`"line"\` - Find production line hierarchy nodes

The search results inherit the dark theme styling with appropriate colors for backgrounds, text, and highlights.
                `
            }
        }
    },
    args: {
        theme: 'dark'
    },
    render: createHierarchyNavigationStory('height: 700px; width: 500px; padding: 20px; background: #1a1a1a;')
};

export const AutocompleteEnabled: Story = {
    name: '6. Autocomplete Suggestions ✨',
    parameters: {
        docs: {
            description: {
                story: `
## Autocomplete Feature

This story demonstrates the **autocomplete suggestions** feature that provides instant instance suggestions as you type.

### How Autocomplete Works

1. **Start typing** - Autocomplete appears after just 1 character
2. **Instant suggestions** - See up to 10 matching instances immediately
3. **Breadcrumb context** - Each suggestion shows its full location path
4. **Select with keyboard** - Use Arrow Up/Down to navigate, Enter to select
5. **Click to select** - Or click a suggestion with the mouse

### Try Typing These:

- \`"temp"\` - See temperature sensors from different locations
- \`"press"\` - See pressure sensors across the hierarchy
- \`"motor"\` - See motor monitoring instances
- \`"energy"\` - See energy meters
- \`"forklift"\` - See forklift telemetry sensors

### Key Features

✅ **Instant Feedback** - Suggestions appear immediately (no debounce delay)  
✅ **Limited Results** - Shows max 10 items to keep dropdown manageable  
✅ **Full Context** - Each suggestion includes breadcrumb path  
✅ **Keyboard Navigation** - Arrow keys, Enter, ESC all work  
✅ **Auto-select First** - First suggestion is pre-selected for quick access  
✅ **Complementary to Search** - Works alongside deep search (which shows full results)  

### Autocomplete vs Deep Search

| Feature | Autocomplete | Deep Search |
|---------|-------------|-------------|
| **Triggers** | 1+ characters typed | 2+ characters typed |
| **Speed** | Instant | 250ms debounced |
| **Results** | Max 10 instances only | All matching hierarchy nodes + instances |
| **UI** | Dropdown list | Flat results with details |
| **Purpose** | Quick instance lookup | Comprehensive search |

### How to Use

1. **Type in search box** - Dropdown appears instantly
2. **Browse suggestions** - Use arrow keys or mouse
3. **Select a suggestion** - Press Enter or click
4. **See full results** - Deep search runs automatically showing all matches

### Technical Details

- **Library**: Uses Awesomplete for dropdown UI
- **Data source**: Calls search function with \`includeInstances: true\`
- **Limit**: \`maxResults: 10\` for autocomplete performance
- **Format**: \`{ label: "path > name", value: "name" }\`

### Note

Autocomplete focuses on **instances (leaves)** only. Hierarchy nodes appear in the deep search results but not in autocomplete suggestions.
                `
            }
        }
    },
    args: {
        theme: 'light',
        autocompleteEnabled: true  // Explicitly show it's enabled
    },
    render: createHierarchyNavigationStory('height: 700px; width: 500px; padding: 20px;')
};

export const AutocompleteDisabled: Story = {
    name: '7. Without Autocomplete 🚫',
    parameters: {
        docs: {
            description: {
                story: `
## Autocomplete Disabled

This story shows the component with **autocomplete disabled** for comparison. The search functionality still works perfectly, but without the instant dropdown suggestions.

### When to Disable Autocomplete

Consider disabling autocomplete in these scenarios:

1. **Performance** - Large hierarchies (10,000+ instances) where autocomplete is slow
2. **Simplicity** - Users prefer minimal UI without dropdown distractions
3. **Mobile** - Touch interfaces where dropdowns may be awkward
4. **Bandwidth** - Limited network where extra requests are costly
5. **Custom UI** - You want to implement your own suggestion system

### What Changes?

**With Autocomplete OFF:**
- ❌ No dropdown suggestions as you type
- ❌ No instant instance lookup
- ❌ No additional network requests for suggestions
- ✅ Search still works (type and wait 250ms for results)
- ✅ Deep search shows full results
- ✅ All keyboard shortcuts work (ESC, Enter)
- ✅ Cleaner, simpler interface

**User Experience:**
1. Type in search box - No dropdown appears
2. Wait 250ms - Full search results appear
3. View results - All matches shown with breadcrumbs
4. Click instances - Selection works normally

### Configuration

Disable autocomplete by passing the option:

\`\`\`typescript
await hierarchyNav.render(searchFunction, {
    theme: 'light',
    autocompleteEnabled: false  // Disable autocomplete
}, preselectedIds);
\`\`\`

### Try It

Type the same searches as the previous story:
- \`"temperature"\` - No dropdown, but full results appear
- \`"pressure"\` - Same behavior
- \`"motor"\` - Notice the simpler, cleaner interface

The search is still fully functional, just without the intermediate autocomplete step!

### Benefits of Disabling

- **Simpler UI** - Less visual clutter
- **Fewer requests** - Only one search query (not autocomplete + deep search)
- **Faster on slow networks** - No extra roundtrips
- **More predictable** - Same behavior every time (no dropdown timing issues)

### Note

This is a **configuration option**, not a permanent state. You can enable/disable it per instance based on your needs. Default is **enabled** to provide the best out-of-the-box experience.
                `
            }
        }
    },
    args: {
        theme: 'light',
        autocompleteEnabled: false  // Disable autocomplete
    },
    render: createHierarchyNavigationStory('height: 700px; width: 500px; padding: 20px;')
};
