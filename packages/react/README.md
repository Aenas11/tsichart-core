# tsichart-react

React components for TSIChart - Time Series Interactive Charts.

## Installation

```bash
npm install tsichart-react tsichart-core
```

## Usage

```tsx
import React from 'react';
import { LineChart } from 'tsichart-react';
import 'tsichart-core/styles';

function App() {
  const data = [/* your time series data */];
  const options = {/* chart options */};

  return (
    <div>
      <LineChart 
        data={data} 
        options={options}
        onRender={() => console.log('Chart rendered')}
      />
    </div>
  );
}
```

## Coming Soon

This package is currently under development. Full documentation will be available soon.

## License

MIT © Alex Sysoiev
