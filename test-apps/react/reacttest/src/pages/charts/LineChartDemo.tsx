import { useEffect, useRef, useState } from 'react';
import TsiClient from 'tsichart-core';
import 'tsichart-core/styles';
import { ChartContainer } from '../../components/ChartContainer';
import { CodeBlock } from '../../components/CodeBlock';
import { generateLineChartData, generateSplitByData } from '../../utils/mockData';
import { DEFAULT_CHART_OPTIONS } from '../../utils/constants';

export function LineChartDemo() {
    const basicChartRef = useRef<HTMLDivElement>(null);
    const multiSeriesRef = useRef<HTMLDivElement>(null);
    const envelopeChartRef = useRef<HTMLDivElement>(null);
    const dotsChartRef = useRef<HTMLDivElement>(null);

    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        if (!basicChartRef.current) return;

        const tsiClient = new TsiClient();
        const lineChart = new tsiClient.LineChart(basicChartRef.current);

        const data = generateLineChartData(2, 50, false);
        lineChart.render(data, { ...DEFAULT_CHART_OPTIONS, theme }, []);

        const currentRef = basicChartRef.current;
        return () => {
            if (currentRef) {
                currentRef.innerHTML = '';
            }
        };
    }, [theme]);

    useEffect(() => {
        if (!multiSeriesRef.current) return;

        const tsiClient = new TsiClient();
        const lineChart = new tsiClient.LineChart(multiSeriesRef.current);

        const data = generateSplitByData(4, 40);
        lineChart.render(data, { ...DEFAULT_CHART_OPTIONS, theme, legend: 'shown' }, []);

        const currentRef = multiSeriesRef.current;
        return () => {
            if (currentRef) {
                currentRef.innerHTML = '';
            }
        };
    }, [theme]);

    useEffect(() => {
        if (!envelopeChartRef.current) return;

        const tsiClient = new TsiClient();
        const lineChart = new tsiClient.LineChart(envelopeChartRef.current);

        const data = generateLineChartData(2, 50, true);
        lineChart.render(data, {
            ...DEFAULT_CHART_OPTIONS,
            theme,
            includeEnvelope: true
        }, []);

        const currentRef = envelopeChartRef.current;
        return () => {
            if (currentRef) {
                currentRef.innerHTML = '';
            }
        };
    }, [theme]);

    useEffect(() => {
        if (!dotsChartRef.current) return;

        const tsiClient = new TsiClient();
        const lineChart = new tsiClient.LineChart(dotsChartRef.current);

        const data = generateLineChartData(1, 20, false);
        lineChart.render(data, {
            ...DEFAULT_CHART_OPTIONS,
            theme,
            includeDots: true
        }, []);

        const currentRef = dotsChartRef.current;
        return () => {
            if (currentRef) {
                currentRef.innerHTML = '';
            }
        };
    }, [theme]);

    const basicCode = `import TsiClient from 'tsichart-core';
import 'tsichart-core/styles';

// Create chart instance
const tsiClient = new TsiClient();
const lineChart = new tsiClient.LineChart(document.getElementById('chart'));

// Prepare data
const data = [{
  "Temperature": {
    "": {
      "2024-01-01T00:00:00Z": { avg: 20.5 },
      "2024-01-01T01:00:00Z": { avg: 21.2 },
      "2024-01-01T02:00:00Z": { avg: 19.8 }
    }
  }
}];

// Render chart
lineChart.render(data, { theme: 'light', legend: 'compact', tooltip: true });`;

    const multiSeriesCode = `// Multi-series with split-by values
const data = [{
  "Temperature": {
    "Factory A": {
      "2024-01-01T00:00:00Z": { avg: 20.5 },
      "2024-01-01T01:00:00Z": { avg: 21.2 }
    },
    "Factory B": {
      "2024-01-01T00:00:00Z": { avg: 25.3 },
      "2024-01-01T01:00:00Z": { avg: 26.1 }
    }
  }
}];

lineChart.render(data, { theme: 'light', legend: 'shown' });`;

    const envelopeCode = `// Line chart with min/max envelope
const data = [{
  "Temperature": {
    "": {
      "2024-01-01T00:00:00Z": { avg: 20.5, min: 18, max: 23 },
      "2024-01-01T01:00:00Z": { avg: 21.2, min: 19, max: 24 }
    }
  }
}];

lineChart.render(data, { 
  theme: 'light', 
  includeEnvelope: true 
});`;

    return (
        <div className="page">
            <header className="page-header">
                <h1>Line Chart</h1>
                <p>Render time series data as interactive line charts</p>
                <div className="page-controls">
                    <label>
                        Theme:
                        <select value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </label>
                </div>
            </header>

            <section className="demo-section">
                <h2>Basic Line Chart</h2>
                <p>Simple line chart with two series</p>

                <ChartContainer title="Basic Example" height="400px">
                    <div ref={basicChartRef} style={{ width: '100%', height: '100%' }} />
                </ChartContainer>

                <CodeBlock code={basicCode} language="typescript" theme={theme} />
            </section>

            <section className="demo-section">
                <h2>Multi-Series Chart</h2>
                <p>Line chart with multiple series using split-by values</p>

                <ChartContainer title="Multi-Series Example" height="400px">
                    <div ref={multiSeriesRef} style={{ width: '100%', height: '100%' }} />
                </ChartContainer>

                <CodeBlock code={multiSeriesCode} language="typescript" theme={theme} />
            </section>

            <section className="demo-section">
                <h2>Envelope Chart</h2>
                <p>Line chart showing min/max range with envelope shading</p>

                <ChartContainer title="Envelope Example" height="400px">
                    <div ref={envelopeChartRef} style={{ width: '100%', height: '100%' }} />
                </ChartContainer>

                <CodeBlock code={envelopeCode} language="typescript" theme={theme} />
            </section>

            <section className="demo-section">
                <h2>Line Chart with Dots</h2>
                <p>Display data points as dots on the line</p>

                <ChartContainer title="Dots Example" height="400px">
                    <div ref={dotsChartRef} style={{ width: '100%', height: '100%' }} />
                </ChartContainer>

                <CodeBlock
                    code={basicCode.replace('tooltip: true', 'tooltip: true, includeDots: true')}
                    language="typescript"
                    theme={theme}
                />
            </section>

            <section className="info-section">
                <h2>Chart Options</h2>
                <ul>
                    <li><strong>theme</strong>: 'light' or 'dark'</li>
                    <li><strong>legend</strong>: 'shown', 'compact', or 'hidden'</li>
                    <li><strong>tooltip</strong>: true to show tooltips on hover</li>
                    <li><strong>includeEnvelope</strong>: true to show min/max range</li>
                    <li><strong>includeDots</strong>: true to show data points</li>
                    <li><strong>yAxisState</strong>: 'stacked', 'shared', or 'overlap'</li>
                    <li><strong>interpolationFunction</strong>: '' (default) or 'curveStep'</li>
                </ul>
            </section>
        </div>
    );
}
