# TSIChart Type Definitions

This folder contains TypeScript type definitions for time series chart data used throughout the tsichart-core library.

## Overview

The type system is **industry-agnostic** and **fully customizable**, allowing you to define metrics specific to your domain:

1. **Generic Types** - Use `ChartData` for maximum flexibility with any metric names
2. **Custom Metrics** - Define your own metric interfaces for type safety and IntelliSense
3. **Runtime Validation** - Use `isChartData()` to validate data from external sources

## Data Structure

All chart components use a consistent nested data structure:

```
ChartData (Array)
  └─ Series (Object)
      └─ SeriesData (Object)
          └─ TimeSeries (Object)
              └─ DataPoint (Object with numeric metrics)
```

### Example Structure

```typescript
[                                    // ChartData: Array
  {                                  // Series: Object
    "Factory0": {                    // Series Name
      "Station0": {                  // Split-By Value (SeriesData)
        "2023-01-01T00:00:00Z": {   // ISO Timestamp (TimeSeries)
          value: 100,                // DataPoint metrics
          temperature: 22.5
        }
      }
    }
  }
]
```

## Usage Examples

### 1. Generic Usage (Most Flexible)

Use `ChartData` without type parameters for maximum flexibility:

```typescript
import { ChartData } from 'tsichart-core/types';

const data: ChartData = [{
  "Temperature": {
    "Sensor1": {
      "2023-01-01T00:00:00Z": { value: 22.5, humidity: 65 },
      "2023-01-01T01:00:00Z": { value: 23.1, humidity: 63 }
    }
  }
}];
```

### 2. Custom Metric Interfaces

Define your own metric interfaces for your specific domain:

```typescript
import { ChartData } from 'tsichart-core/types';

// Manufacturing/Industrial
interface FactoryMetrics extends Record<string, number> {
  value: number;
  temperature: number;
  pressure?: number;
}

// IoT/Smart Home
interface SensorMetrics extends Record<string, number> {
  temperature: number;
  humidity: number;
  batteryLevel: number;
}

// Financial/Trading
interface StockMetrics extends Record<string, number> {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Healthcare/Medical
interface VitalSignsMetrics extends Record<string, number> {
  heartRate: number;
  bloodPressure: number;
  oxygenSaturation: number;
}

// Energy/Utilities
interface PowerMetrics extends Record<string, number> {
  voltage: number;
  current: number;
  power: number;
  frequency: number;
}

// Use with ChartData
const factoryData: ChartData<FactoryMetrics> = [{
  "Factory0": {
    "Station0": {
      "2023-01-01T00:00:00Z": { value: 100, temperature: 22.5 }
    }
  }
}];

const sensorData: ChartData<SensorMetrics> = [{
  "LivingRoom": {
    "Sensor1": {
      "2023-01-01T00:00:00Z": { 
        temperature: 22.5, 
        humidity: 65, 
        batteryLevel: 87 
      }
    }
  }
}];
```

### 3. Working with Individual Components

You can also work with the individual type components:

```typescript
import { 
  DataPoint, 
  TimeSeries, 
  SeriesData, 
  Series 
} from 'tsichart-core/types';

// Individual data point
const point: DataPoint = { value: 100, temperature: 22 };

// Time series for one split-by
const timeSeries: TimeSeries = {
  "2023-01-01T00:00:00Z": { value: 100 },
  "2023-01-01T01:00:00Z": { value: 105 }
};

// Series data with multiple split-bys
const seriesData: SeriesData = {
  "Station0": timeSeries,
  "Station1": { "2023-01-01T00:00:00Z": { value: 95 } }
};

// Complete series
const series: Series = {
  "Factory0": seriesData
};
```

## Type Safety Features

### 1. Runtime Type Guard

Use the `isChartData` function to validate data at runtime:

```typescript
import { isChartData } from 'tsichart-core/types';

function processData(data: unknown) {
  if (isChartData(data)) {
    // TypeScript knows data is ChartData here
    console.log('Valid chart data with', data.length, 'series');
  } else {
    throw new Error('Invalid chart data format');
  }
}
```

### 2. Type Extraction Helpers

Extract types from your data:

```typescript
import { SeriesName, SplitByValue, ChartData } from 'tsichart-core/types';

type MyData = ChartData<{ value: number }>;

// Extract the series names as a union type
type MySeriesNames = SeriesName<MyData>; // string

// Can be useful for strongly-typed configuration
```

## Using with Chart Components

### LineChart Example

```typescript
import LineChart from 'tsichart-core/LineChart';
import { FactoryChartData } from 'tsichart-core/types';

const chart = new LineChart(document.getElementById('chart'));

const data: FactoryChartData = [{
  "Factory0": {
    "Station0": {
      "2023-01-01T00:00:00Z": { value: 100, temperature: 22.5 }
    }
  }
}];

chart.render(data, { theme: 'light' });
```

### Function That Generates Data

```typescript
import { ChartData, FactoryMetrics } from 'tsichart-core/types';

function generateFactoryData(): ChartData<FactoryMetrics> {
  const data: ChartData<FactoryMetrics> = [];
  
  for (let i = 0; i < 3; i++) {
    const series: Record<string, Record<string, Record<string, FactoryMetrics>>> = {};
    const factoryName = `Factory${i}`;
    series[factoryName] = {};
    
    for (let j = 0; j < 3; j++) {
      const stationName = `Station${j}`;
      series[factoryName][stationName] = {};
      
      const timestamp = new Date().toISOString();
      series[factoryName][stationName][timestamp] = {
        value: 100 + i * 10 + j * 5,
        temperature: 20 + Math.random() * 5
      };
    }
    
    data.push(series);
  }
  
  return data;
}
```

## Best Practices

1. **Start Generic, Add Types Later**: Begin with `ChartData` without type parameters, then add strong typing as your data structure stabilizes

2. **Define Domain-Specific Types**: Create metric interfaces that match your industry and use case

3. **Always Extend `Record<string, number>`**: This allows TypeScript to properly type-check your metrics while maintaining flexibility
   ```typescript
   interface MyMetrics extends Record<string, number> {
     myMetric: number;
   }
   ```

4. **Validate at Runtime**: Use `isChartData` to validate data from external sources (APIs, user input)

5. **Document Your Metrics**: Add JSDoc comments to custom metric interfaces to document units, ranges, and meaning
   ```typescript
   /**
    * Sensor readings from industrial equipment
    */
   interface SensorMetrics extends Record<string, number> {
     /** Temperature in Celsius */
     temperature: number;
     /** Pressure in PSI */
     pressure: number;
   }
   ```

6. **Keep It Simple**: Only define the metrics you actually use. The type system is flexible enough to accommodate additional metrics later

## Migration from `any`

If you have existing code using `any`:

```typescript
// Before
const data: any = [{ /* ... */ }];
chart.render(data, options);

// After
import { ChartData } from 'tsichart-core/types';

const data: ChartData = [{ /* ... */ }];
chart.render(data, options);
```

## Files

- **`ChartData.ts`** - Core type definitions and type guard
- **`index.ts`** - Re-exports all types for convenient importing
- **`examples.ts`** - Working examples demonstrating the type system

## Philosophy

The tsichart-core type system is intentionally **generic and unopinionated**. We don't provide pre-defined metric types because:

1. **Industry Agnostic**: Your metrics depend on your domain (manufacturing, IoT, finance, healthcare, etc.)
2. **Maximum Flexibility**: You know your data better than we do
3. **No Lock-in**: The library doesn't force you to use specific property names
4. **Simple & Powerful**: The base `ChartData` type works with any numeric metrics

## Contributing

When adding new chart components or data formats:

1. Ensure compatibility with the existing `ChartData` structure
2. Maintain the generic, industry-agnostic approach
3. Update this README with examples
4. Add JSDoc documentation to new types
