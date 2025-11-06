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
    return async (payload: { path: string[], hierarchy: any }): Promise<any> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 200));

        // Build the path key from the payload
        const pathKey = payload.path.join('/');

        // Return the corresponding data or empty result
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
- **Search Functionality**: Search and filter through the hierarchy
- **Multi-selection**: Select multiple instances
- **Theming**: Support for light and dark themes

## Usage Example

\`\`\`typescript
import TsiClient from 'tsichart-core';

const tsiClient = new TsiClient();
const hierarchyNav = new tsiClient.HierarchyNavigation(containerElement);

// Mock search function that fetches hierarchy data
const searchFunction = async (payload) => {
    // Fetch data from your API
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
- Keyboard: Use Arrow Up / Down to move, Arrow Right to expand or move into children, Arrow Left to collapse or move to parent. Enter or Space toggles expand/select depending on focused item.
- Search: The search box uses a 250ms debounce to reduce work while typing. Server requests are protected from race conditions (stale responses are ignored) and display names are cached for fast client-side filtering.
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
