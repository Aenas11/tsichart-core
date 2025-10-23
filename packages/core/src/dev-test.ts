// Development test script for TSIChart Core
import { UXClient } from './index';

declare global {
    interface Window {
        TsiClient: any;
        d3: any;
        moment: any;
    }
}

let uxClient: UXClient | null = null;
let chartInstance: any = null;
let sampleData: any = null;

function updateStatus(message: string, type: string = '') {
    const statusEl = document.getElementById('status');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = 'status ' + type;
    }
}

function generateSampleData() {
    // Generate sample time series data 
    const data = [];
    const from = new Date(Math.floor((new Date()).valueOf() / (1000 * 60 * 60)) * (1000 * 60 * 60));
    let to;

    for (let i = 0; i < 3; i++) {
        const lines = {};
        data.push({ [`Factory${i}`]: lines });
        for (let j = 0; j < 5; j++) {
            const values = {};
            lines[`Station${j}`] = values;
            for (let k = 0; k < 10; k++) {
                if (!(k % 2 && k % 3)) {  // if check is to create some sparseness in the data
                    to = new Date(from.valueOf() + 1000 * 60 * k);
                    const val = Math.random();
                    values[to.toISOString()] = { value: val, temperature: 20 + Math.sin(i / 10) * 5 + Math.random() * 2 };
                }
            }
        }
    }

    sampleData = { data };
    updateStatus('Sample data generated', 'success');
}

function createLineChart() {
    if (!uxClient) {
        updateStatus('TSIChart not loaded yet', 'error');
        return;
    }

    if (!sampleData) {
        generateSampleData();
    }

    try {
        // Clear previous chart
        const chartContainer = document.getElementById('lineChart');
        if (chartContainer) {
            chartContainer.innerHTML = '';
        }

        // Create LineChart instance
        chartInstance = new uxClient.LineChart(chartContainer);

        const options = {
            theme: 'light',
            legend: 'shown',
            grid: true,
            tooltip: true,
            yAxisState: 'stacked',
            interpolationFunction: 'curveMonotoneX',
            includeEnvelope: false,
            brushContextMenuActions: [],
            snapBrush: false,
            minBrushWidth: 0,
            is24HourTime: true,
            offset: 'Local',
            zeroYAxis: false
        };

        // Set a breakpoint here - this should now be debuggable!
        console.log('About to render chart with data:', sampleData.data);

        // This should trigger the console.log in LineChart.render()
        chartInstance.render(sampleData.data, options);

        updateStatus('LineChart created and rendered successfully!', 'success');

        // Add debug info
        const debugOutput = document.getElementById('debug-output');
        if (debugOutput) {
            debugOutput.innerHTML = `
                <h4>Debug Information:</h4>
                <p>Chart created with ${sampleData.data.length} data points</p>
                <p>Check console for "LineChart render called" message</p>
                <p>Set breakpoints in packages/core/src/components/LineChart/LineChart.ts</p>
                <p>Set breakpoints in packages/core/src/dev-test.ts</p>
            `;
        }

    } catch (error) {
        console.error('Failed to create LineChart:', error);
        updateStatus(`Failed to create LineChart: ${error.message}`, 'error');
    }
}

function clearChart() {
    const chart1 = document.getElementById('chart1');
    const chart2 = document.getElementById('chart2');
    const debugOutput = document.getElementById('debug-output');

    if (chart1) chart1.innerHTML = '';
    if (chart2) chart2.innerHTML = '';
    if (debugOutput) debugOutput.innerHTML = '';

    chartInstance = null;
    updateStatus('Charts cleared');
}

function testDebugger() {
    console.log('Testing debugger - set a breakpoint here!');
    debugger; // This will trigger the debugger and should now be debuggable
    updateStatus('Debugger test completed - check DevTools');
}

// Initialize when page loads
window.addEventListener('load', async () => {
    try {
        // Check if dependencies are loaded
        if (typeof window.d3 === 'undefined') {
            throw new Error('D3.js is not loaded');
        }
        if (typeof window.moment === 'undefined') {
            throw new Error('Moment.js is not loaded');
        }

        // Try to load the UMD build first, then fallback to ESM
        if (typeof window.TsiClient !== 'undefined') {
            // The UMD build should export the UXClient class directly
            uxClient = new window.TsiClient();
            updateStatus('TSIChart core library loaded successfully (UMD)', 'success');
        } else {
            // Use the imported UXClient directly
            uxClient = new UXClient();
            updateStatus('TSIChart core library loaded successfully (ESM)', 'success');
        }

        generateSampleData();

    } catch (error) {
        console.error('Failed to load TSIChart:', error);
        updateStatus(`Failed to load TSIChart: ${error.message}`, 'error');
    }
});

// Expose functions globally so they can be called from HTML
(window as any).createLineChart = createLineChart;
(window as any).generateSampleData = generateSampleData;
(window as any).clearChart = clearChart;
(window as any).testDebugger = testDebugger;
