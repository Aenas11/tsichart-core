# Running the TSIChart React Test App

## Quick Start

```bash
# Navigate to the app directory
cd /workspaces/TSIClient/test-apps/react/reacttest

# Install dependencies (if not done already)
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

## What's Included

This React app tests and demonstrates all tsichart-core functionality:

### ✅ Created
- Navigation sidebar with routing
- Home page with overview
- LineChart demo page with multiple examples
- Reusable components (Navigation, CodeBlock, ChartContainer)
- Custom hooks for chart management
- Mock data generators
- Type definitions
- Responsive CSS styling

### 🚧 To Be Added
You can expand this app by adding more demo pages:

- Bar Chart demo
- Pie Chart demo
- Heatmap demo  
- Scatter Plot demo
- Multi-type chart (events, categorical)
- Brush actions demo
- Interactive features
- More UI components

## Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Route pages
│   ├── Home.tsx
│   └── charts/
│       └── LineChartDemo.tsx
├── utils/            # Utilities and helpers
├── hooks/            # Custom React hooks
├── types/            # TypeScript types
├── App.tsx           # Main app with routing
├── main.tsx          # Entry point
└── App.css           # Styles
```

## Adding New Demo Pages

1. Create a new file in `src/pages/` or `src/pages/charts/`
2. Import and use tsichart-core components
3. Add route in `src/App.tsx`
4. Add navigation link in `src/utils/constants.ts`

Example:
```typescript
// src/pages/charts/BarChartDemo.tsx
import { useEffect, useRef } from 'react';
import TsiClient from 'tsichart-core';

export function BarChartDemo() {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    const tsiClient = new TsiClient();
    const barChart = new tsiClient.BarChart(chartRef.current);
    // ... render chart
  }, []);
  
  return <div ref={chartRef} />;
}
```

## Technologies

- React 19
- TypeScript
- Vite
- React Router
- React Syntax Highlighter
- Lucide React (icons)
- tsichart-core

Enjoy testing tsichart-core! 🎉
